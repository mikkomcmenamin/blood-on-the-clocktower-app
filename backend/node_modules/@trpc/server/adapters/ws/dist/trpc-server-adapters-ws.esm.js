import { T as TRPCError, a as getErrorFromUnknown, t as transformTRPCResponse, c as callProcedure } from '../../../dist/transformTRPCResponse-56464e52.esm.js';
import { S as Subscription } from '../../../dist/subscription-a5c83df4.esm.js';
import 'events';

/* istanbul ignore next */
function assertIsObject(obj) {
  if (typeof obj !== 'object' || Array.isArray(obj) || !obj) {
    throw new Error('Not an object');
  }
}
/* istanbul ignore next */


function assertIsProcedureType(obj) {
  if (obj !== 'query' && obj !== 'subscription' && obj !== 'mutation') {
    throw new Error('Invalid procedure type');
  }
}
/* istanbul ignore next */


function assertIsRequestId(obj) {
  if (obj !== null && typeof obj === 'number' && isNaN(obj) && typeof obj !== 'string') {
    throw new Error('Invalid request id');
  }
}
/* istanbul ignore next */


function assertIsString(obj) {
  if (typeof obj !== 'string') {
    throw new Error('Invalid string');
  }
}
/* istanbul ignore next */


function assertIsJSONRPC2OrUndefined(obj) {
  if (typeof obj !== 'undefined' && obj !== '2.0') {
    throw new Error('Must be JSONRPC 2.0');
  }
}

function parseMessage(obj, transformer) {
  assertIsObject(obj);
  const {
    method,
    params,
    id,
    jsonrpc
  } = obj;
  assertIsRequestId(id);
  assertIsJSONRPC2OrUndefined(jsonrpc);

  if (method === 'subscription.stop') {
    return {
      id,
      method,
      params: undefined
    };
  }

  assertIsProcedureType(method);
  assertIsObject(params);
  const {
    input: rawInput,
    path
  } = params;
  assertIsString(path);
  const input = transformer.input.deserialize(rawInput);
  return {
    jsonrpc,
    id,
    method,
    params: {
      input,
      path
    }
  };
}
/**
 * Web socket server handler
 */


function applyWSSHandler(opts) {
  const {
    wss,
    createContext,
    router
  } = opts;
  const {
    transformer
  } = router._def;
  wss.on('connection', async (client, req) => {
    const clientSubscriptions = new Map();

    function respond(untransformedJSON) {
      client.send(JSON.stringify(transformTRPCResponse(router, untransformedJSON)));
    }

    const ctxPromise = createContext === null || createContext === void 0 ? void 0 : createContext({
      req,
      res: client
    });
    let ctx = undefined;

    async function handleRequest(msg) {
      const {
        id
      } = msg;
      /* istanbul ignore next */

      if (id === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '`id` is required'
        });
      }

      if (msg.method === 'subscription.stop') {
        const sub = clientSubscriptions.get(id);

        if (sub) {
          sub.destroy();
        }

        clientSubscriptions.delete(id);
        return;
      }

      const {
        path,
        input
      } = msg.params;
      const type = msg.method;

      try {
        await ctxPromise; // asserts context has been set

        const result = await callProcedure({
          path,
          input,
          type,
          router,
          ctx
        });

        if (!(result instanceof Subscription)) {
          respond({
            id,
            result: {
              type: 'data',
              data: result
            }
          });
          return;
        }

        const sub = result;
        /* istanbul ignore next */

        if (client.readyState !== client.OPEN) {
          // if the client got disconnected whilst initializing the subscription
          sub.destroy();
          return;
        }
        /* istanbul ignore next */


        if (clientSubscriptions.has(id)) {
          // duplicate request ids for client
          sub.destroy();
          throw new TRPCError({
            message: `Duplicate id ${id}`,
            code: 'BAD_REQUEST'
          });
        }

        clientSubscriptions.set(id, sub);
        sub.on('data', data => {
          respond({
            id,
            result: {
              type: 'data',
              data
            }
          });
        });
        sub.on('error', _error => {
          var _opts$onError;

          const error = getErrorFromUnknown(_error);
          const json = {
            id,
            error: router.getErrorShape({
              error,
              type,
              path,
              input,
              ctx
            })
          };
          (_opts$onError = opts.onError) === null || _opts$onError === void 0 ? void 0 : _opts$onError.call(opts, {
            error,
            path,
            type,
            ctx,
            req,
            input
          });
          respond(json);
        });
        sub.on('destroy', () => {
          respond({
            id,
            result: {
              type: 'stopped'
            }
          });
        });
        respond({
          id,
          result: {
            type: 'started'
          }
        });
        await sub.start();
      } catch (cause)
      /* istanbul ignore next */
      {
        var _opts$onError2;

        // procedure threw an error
        const error = getErrorFromUnknown(cause);
        const json = router.getErrorShape({
          error,
          type,
          path,
          input,
          ctx
        });
        (_opts$onError2 = opts.onError) === null || _opts$onError2 === void 0 ? void 0 : _opts$onError2.call(opts, {
          error,
          path,
          type,
          ctx,
          req,
          input
        });
        respond({
          id,
          error: json
        });
      }
    }

    client.on('message', async message => {
      try {
        const msgJSON = JSON.parse(message.toString());
        const msgs = Array.isArray(msgJSON) ? msgJSON : [msgJSON];
        const promises = msgs.map(raw => parseMessage(raw, transformer)).map(handleRequest);
        await Promise.all(promises);
      } catch (cause) {
        const error = new TRPCError({
          code: 'PARSE_ERROR',
          cause
        });
        respond({
          id: null,
          error: router.getErrorShape({
            error,
            type: 'unknown',
            path: undefined,
            input: undefined,
            ctx: undefined
          })
        });
      }
    }); // WebSocket errors should be handled, as otherwise unhandled exceptions will crash Node.js.
    // This line was introduced after the following error brought down production systems:
    // "RangeError: Invalid WebSocket frame: RSV2 and RSV3 must be clear"
    // Here is the relevant discussion: https://github.com/websockets/ws/issues/1354#issuecomment-774616962

    client.on('error', cause => {
      var _opts$onError3;

      (_opts$onError3 = opts.onError) === null || _opts$onError3 === void 0 ? void 0 : _opts$onError3.call(opts, {
        ctx,
        error: getErrorFromUnknown(cause),
        input: undefined,
        path: undefined,
        type: 'unknown',
        req
      });
    });
    client.once('close', () => {
      for (const sub of clientSubscriptions.values()) {
        sub.destroy();
      }

      clientSubscriptions.clear();
    });

    async function createContextAsync() {
      try {
        ctx = await ctxPromise;
      } catch (cause) {
        var _opts$onError4, _global$setImmediate;

        const error = getErrorFromUnknown(cause);
        const json = {
          id: null,
          error: router.getErrorShape({
            error,
            type: 'unknown',
            path: undefined,
            input: undefined,
            ctx
          })
        };
        (_opts$onError4 = opts.onError) === null || _opts$onError4 === void 0 ? void 0 : _opts$onError4.call(opts, {
          error,
          path: undefined,
          type: 'unknown',
          ctx,
          req,
          input: undefined
        });
        respond(json); // close in next tick

        ((_global$setImmediate = global.setImmediate) !== null && _global$setImmediate !== void 0 ? _global$setImmediate : global.setTimeout)(() => {
          client.close();
        });
      }
    }

    await createContextAsync();
  });
  return {
    broadcastReconnectNotification: () => {
      const response = {
        id: null,
        method: 'reconnect'
      };
      const data = JSON.stringify(response);

      for (const client of wss.clients) {
        if (client.readyState === 1
        /* ws.OPEN */
        ) {
          client.send(data);
        }
      }
    }
  };
}

export { applyWSSHandler };
