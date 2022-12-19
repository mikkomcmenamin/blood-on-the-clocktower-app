import { URLSearchParams } from 'url';
import { a as assertNotBrowser, r as resolveHTTPResponse } from '../../../dist/resolveHTTPResponse-fcf14f5a.esm.js';
import { applyWSSHandler } from '../../ws/dist/trpc-server-adapters-ws.esm.js';
import '../../../dist/transformTRPCResponse-56464e52.esm.js';
import '../../../dist/codes-5678cc97.esm.js';
import '../../../dist/subscription-a5c83df4.esm.js';
import 'events';

assertNotBrowser();
async function fastifyRequestHandler(opts) {
  var _opts$req$body;

  const createContext = async function _createContext() {
    var _opts$createContext;

    return (_opts$createContext = opts.createContext) === null || _opts$createContext === void 0 ? void 0 : _opts$createContext.call(opts, opts);
  };

  const query = opts.req.query ? new URLSearchParams(opts.req.query) : new URLSearchParams(opts.req.url.split('?')[1]);
  const req = {
    query,
    method: opts.req.method,
    headers: opts.req.headers,
    body: (_opts$req$body = opts.req.body) !== null && _opts$req$body !== void 0 ? _opts$req$body : 'null'
  };
  const result = await resolveHTTPResponse({
    req,
    createContext,
    path: opts.path,
    router: opts.router,
    batching: opts.batching,
    responseMeta: opts.responseMeta,

    onError(o) {
      var _opts$onError;

      opts === null || opts === void 0 ? void 0 : (_opts$onError = opts.onError) === null || _opts$onError === void 0 ? void 0 : _opts$onError.call(opts, { ...o,
        req: opts.req
      });
    }

  });
  const {
    res
  } = opts;

  if ('status' in result && (!res.statusCode || res.statusCode === 200)) {
    res.statusCode = result.status;
  }

  for (const [key, value] of Object.entries((_result$headers = result.headers) !== null && _result$headers !== void 0 ? _result$headers : {})) {
    var _result$headers;

    if (typeof value === 'undefined') {
      continue;
    }

    void res.header(key, value);
  }

  await res.send(result.body);
}

/// <reference types="@fastify/websocket" />
function fastifyTRPCPlugin(fastify, opts, done) {
  var _opts$prefix;

  fastify.addContentTypeParser('application/json', {
    parseAs: 'string'
  }, function (_, body, _done) {
    _done(null, body);
  });
  let prefix = (_opts$prefix = opts.prefix) !== null && _opts$prefix !== void 0 ? _opts$prefix : ''; // https://github.com/fastify/fastify-plugin/blob/fe079bef6557a83794bf437e14b9b9edb8a74104/plugin.js#L11
  // @ts-expect-error property 'default' does not exists on type ...

  if (typeof fastifyTRPCPlugin.default !== 'function') {
    prefix = ''; // handled by fastify internally
  }

  fastify.all(`${prefix}/:path`, async (req, res) => {
    const path = req.params.path;
    await fastifyRequestHandler({ ...opts.trpcOptions,
      req,
      res,
      path
    });
  });

  if (opts.useWSS) {
    var _prefix;

    applyWSSHandler({ ...opts.trpcOptions,
      wss: fastify.websocketServer
    }); // eslint-disable-next-line @typescript-eslint/no-empty-function

    fastify.get((_prefix = prefix) !== null && _prefix !== void 0 ? _prefix : '/', {
      websocket: true
    }, () => {});
  }

  done();
}

export { fastifyRequestHandler, fastifyTRPCPlugin };
