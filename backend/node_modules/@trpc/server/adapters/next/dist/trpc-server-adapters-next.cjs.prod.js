'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var transformTRPCResponse = require('../../../dist/transformTRPCResponse-077b7539.cjs.prod.js');
var nodeHTTPRequestHandler = require('../../../dist/nodeHTTPRequestHandler-21707788.cjs.prod.js');
require('url');
require('../../../dist/resolveHTTPResponse-9812e803.cjs.prod.js');
require('../../../dist/codes-aff770a3.cjs.prod.js');

/* eslint-disable @typescript-eslint/no-explicit-any */
function createNextApiHandler(opts) {
  return async (req, res) => {
    function getPath() {
      if (typeof req.query.trpc === 'string') {
        return req.query.trpc;
      }

      if (Array.isArray(req.query.trpc)) {
        return req.query.trpc.join('/');
      }

      return null;
    }

    const path = getPath();

    if (path === null) {
      const error = opts.router.getErrorShape({
        error: new transformTRPCResponse.TRPCError({
          message: 'Query "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
          code: 'INTERNAL_SERVER_ERROR'
        }),
        type: 'unknown',
        ctx: undefined,
        path: undefined,
        input: undefined
      });
      const json = {
        id: -1,
        error
      };
      res.statusCode = 500;
      res.json(json);
      return;
    }

    await nodeHTTPRequestHandler.nodeHTTPRequestHandler({ ...opts,
      req,
      res,
      path
    });
  };
}

exports.createNextApiHandler = createNextApiHandler;
