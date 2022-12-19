'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var transformTRPCResponse = require('../../../dist/transformTRPCResponse-36a41418.cjs.dev.js');
require('../../../dist/router-ee876044.cjs.dev.js');
require('events');
require('http');
require('url');
require('../../../dist/nodeHTTPRequestHandler-9a93c255.cjs.dev.js');
var resolveHTTPResponse = require('../../../dist/resolveHTTPResponse-ab01e4b9.cjs.dev.js');
require('../../../dist/codes-130e62df.cjs.dev.js');

function isPayloadV1(event) {
  return determinePayloadFormat(event) == '1.0';
}
function isPayloadV2(event) {
  return determinePayloadFormat(event) == '2.0';
}

function determinePayloadFormat(event) {
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  // According to AWS support, version is is extracted from the version property in the event.
  // If there is no version property, then the version is implied as 1.0
  const unknownEvent = event;

  if (typeof unknownEvent.version === 'undefined') {
    return '1.0';
  } else {
    if (['1.0', '2.0'].includes(unknownEvent.version)) {
      return unknownEvent.version;
    } else {
      return 'custom';
    }
  }
}

const UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE = 'Custom payload format version not handled by this adapter. Please use either 1.0 or 2.0. More information here' + 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html';

function lambdaEventToHTTPRequest(event) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries((_event$queryStringPar = event.queryStringParameters) !== null && _event$queryStringPar !== void 0 ? _event$queryStringPar : {})) {
    var _event$queryStringPar;

    if (typeof value !== 'undefined') {
      query.append(key, value);
    }
  }

  return {
    method: getHTTPMethod(event),
    query: query,
    headers: event.headers,
    body: event.body
  };
}

function getHTTPMethod(event) {
  if (isPayloadV1(event)) {
    return event.httpMethod;
  }

  if (isPayloadV2(event)) {
    return event.requestContext.http.method;
  }

  throw new transformTRPCResponse.TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE
  });
}

function getPath(event) {
  if (isPayloadV1(event)) {
    const matches = event.resource.matchAll(/\{(.*?)\}/g);

    for (const match of matches) {
      const group = match[1];

      if (group.includes('+') && event.pathParameters) {
        return event.pathParameters[group.replace('+', '')] || '';
      }
    }

    return event.path.slice(1);
  }

  if (isPayloadV2(event)) {
    const matches = event.routeKey.matchAll(/\{(.*?)\}/g);

    for (const match of matches) {
      const group = match[1];

      if (group.includes('+') && event.pathParameters) {
        return event.pathParameters[group.replace('+', '')] || '';
      }
    }

    return event.rawPath.slice(1);
  }

  throw new transformTRPCResponse.TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE
  });
}

function transformHeaders(headers) {
  const obj = {};

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'undefined') {
      continue;
    }

    obj[key] = Array.isArray(value) ? value.join(',') : value;
  }

  return obj;
}

function tRPCOutputToAPIGatewayOutput(event, response) {
  if (isPayloadV1(event)) {
    var _response$body, _response$headers;

    const resp = {
      statusCode: response.status,
      body: (_response$body = response.body) !== null && _response$body !== void 0 ? _response$body : '',
      headers: transformHeaders((_response$headers = response.headers) !== null && _response$headers !== void 0 ? _response$headers : {})
    };
    return resp;
  } else if (isPayloadV2(event)) {
    var _response$body2, _response$headers2;

    const resp = {
      statusCode: response.status,
      body: (_response$body2 = response.body) !== null && _response$body2 !== void 0 ? _response$body2 : undefined,
      headers: transformHeaders((_response$headers2 = response.headers) !== null && _response$headers2 !== void 0 ? _response$headers2 : {})
    };
    return resp;
  } else {
    throw new transformTRPCResponse.TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE
    });
  }
}
/** Will check the createContext of the TRouter and get the parameter of event.
 * @internal
 **/


function awsLambdaRequestHandler(opts) {
  return async (event, context) => {
    const req = lambdaEventToHTTPRequest(event);
    const path = getPath(event);

    const createContext = async function _createContext() {
      var _opts$createContext;

      return await ((_opts$createContext = opts.createContext) === null || _opts$createContext === void 0 ? void 0 : _opts$createContext.call(opts, {
        event,
        context
      }));
    };

    const response = await resolveHTTPResponse.resolveHTTPResponse({
      router: opts.router,
      batching: opts.batching,
      responseMeta: opts === null || opts === void 0 ? void 0 : opts.responseMeta,
      createContext,
      req,
      path,
      error: null,

      onError(o) {
        var _opts$onError;

        opts === null || opts === void 0 ? void 0 : (_opts$onError = opts.onError) === null || _opts$onError === void 0 ? void 0 : _opts$onError.call(opts, { ...o,
          req: event
        });
      }

    });
    return tRPCOutputToAPIGatewayOutput(event, response);
  };
}

exports.awsLambdaRequestHandler = awsLambdaRequestHandler;
