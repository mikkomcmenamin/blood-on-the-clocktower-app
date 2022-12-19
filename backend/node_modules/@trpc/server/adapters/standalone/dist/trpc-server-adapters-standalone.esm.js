import http from 'http';
import url from 'url';
import { n as nodeHTTPRequestHandler } from '../../../dist/nodeHTTPRequestHandler-4e09fc4c.esm.js';
import '../../../dist/resolveHTTPResponse-fcf14f5a.esm.js';
import '../../../dist/transformTRPCResponse-56464e52.esm.js';
import '../../../dist/codes-5678cc97.esm.js';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
function createHTTPHandler(opts) {
  return async (req, res) => {
    const endpoint = url.parse(req.url).pathname.slice(1);
    await nodeHTTPRequestHandler({ ...opts,
      req,
      res,
      path: endpoint
    });
  };
}
function createHTTPServer(opts) {
  const handler = createHTTPHandler(opts);
  const server = http.createServer((req, res) => handler(req, res));
  return {
    server,

    listen(port) {
      server.listen(port);
      const actualPort = port === 0 ? server.address().port : port;
      return {
        port: actualPort
      };
    }

  };
}

export { createHTTPHandler, createHTTPServer };
