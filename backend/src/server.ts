import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import http from "http";
import ws from "ws";
import { createAppRouter, createContext, AppRouter } from "@common/router";

const router = createAppRouter();
// http server
const handler = createHTTPHandler({
  router,
  createContext,
});

const server = http.createServer((req, res) => {
  if (process.env.FRONTEND_URL) {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  }

  console.log("Got request", req.method, req.url, JSON.stringify(req.headers));

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // health endpoint required for deployment
  if (req.url === "/health") {
    res.writeHead(200);
    res.end();
    return;
  }

  return handler(req, res);
});

// ws server
const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
  wss,
  router,
  createContext,
});

// listen on 0.0.0.0 to allow e.g. mobile phone on same network to connect
const PORT = Number(process.env.PORT) || 2022;
server.listen(PORT, "0.0.0.0");
