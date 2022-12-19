import { n as nodeHTTPRequestHandler } from '../../../dist/nodeHTTPRequestHandler-4e09fc4c.esm.js';
import 'url';
import '../../../dist/resolveHTTPResponse-fcf14f5a.esm.js';
import '../../../dist/transformTRPCResponse-56464e52.esm.js';
import '../../../dist/codes-5678cc97.esm.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
function createExpressMiddleware(opts) {
  return async (req, res) => {
    const endpoint = req.path.slice(1);
    await nodeHTTPRequestHandler({ ...opts,
      req,
      res,
      path: endpoint
    });
  };
}

export { createExpressMiddleware };
