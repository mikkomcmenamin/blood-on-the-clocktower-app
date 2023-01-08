import { AppRouter } from "@common/router";
import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";

export const semaphore = {
  lock: Promise.resolve(),
  unlock: () => {},
};

// create persistent WebSocket connection
const wsClient = createWSClient({
  url:
    import.meta.env.VITE_BACKEND_URL ?? `ws://${window.location.hostname}:2022`,
});

// configure TRPCClient to use WebSockets transport
export const client = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});
