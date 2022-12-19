import { T as TRPCError } from '../../../dist/transformTRPCResponse-56464e52.esm.js';
import { n as nodeHTTPRequestHandler } from '../../../dist/nodeHTTPRequestHandler-4e09fc4c.esm.js';
import 'url';
import '../../../dist/resolveHTTPResponse-fcf14f5a.esm.js';
import '../../../dist/codes-5678cc97.esm.js';

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
        error: new TRPCError({
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

    await nodeHTTPRequestHandler({ ...opts,
      req,
      res,
      path
    });
  };
}

export { createNextApiHandler };
