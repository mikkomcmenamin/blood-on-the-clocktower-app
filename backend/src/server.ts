import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import {
  CreateHTTPContextOptions,
  createHTTPServer,
} from "@trpc/server/adapters/standalone";
import {
  CreateWSSContextFnOptions,
  applyWSSHandler,
} from "@trpc/server/adapters/ws";
import ws from "ws";
import { gameActionSchema } from "@common/gameLogic";

function createContext(
  opts: CreateHTTPContextOptions | CreateWSSContextFnOptions
) {
  return {};
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  gameAction: publicProcedure.input(gameActionSchema).mutation(({ input }) => {
    // TODO: make this do something
    return {
      id: `${Math.random()}`,
      ...input,
    };
  }),
});

export type AppRouter = typeof appRouter;

// http server
const { server, listen } = createHTTPServer({
  router: appRouter,
  createContext,
});

// ws server
const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
});

listen(2022);
