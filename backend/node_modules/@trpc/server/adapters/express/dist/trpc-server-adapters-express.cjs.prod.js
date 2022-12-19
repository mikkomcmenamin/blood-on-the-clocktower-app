'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nodeHTTPRequestHandler = require('../../../dist/nodeHTTPRequestHandler-21707788.cjs.prod.js');
require('url');
require('../../../dist/resolveHTTPResponse-9812e803.cjs.prod.js');
require('../../../dist/transformTRPCResponse-077b7539.cjs.prod.js');
require('../../../dist/codes-aff770a3.cjs.prod.js');

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
