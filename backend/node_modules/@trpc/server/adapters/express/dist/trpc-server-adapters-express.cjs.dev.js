'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nodeHTTPRequestHandler = require('../../../dist/nodeHTTPRequestHandler-9a93c255.cjs.dev.js');
require('url');
require('../../../dist/resolveHTTPResponse-ab01e4b9.cjs.dev.js');
require('../../../dist/transformTRPCResponse-36a41418.cjs.dev.js');
require('../../../dist/codes-130e62df.cjs.dev.js');

/* eslint-disable @typescript-eslint/no-explicit-any */
function createExpressMiddleware(opts) {
  return async (req, res) => {
    const endpoint = req.path.slice(1);
    await nodeHTTPRequestHandler.nodeHTTPRequestHandler({ ...opts,
      req,
      res,
      path: endpoint
    });
  };
}

exports.createExpressMiddleware = createExpressMiddleware;
