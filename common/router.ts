import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { gameActionSchema } from "./gameLogic";

const e = new EventEmitter();

export function createContext(
  opts: CreateHTTPContextOptions | CreateWSSContextFnOptions
) {
  return {};
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  onHeartbeat: publicProcedure.subscription(() => {
    return observable<"pong">((emit) => {
      const interval = setInterval(() => {
        emit.next("pong");
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
  }),
  gameAction: publicProcedure
    .input(gameActionSchema)
    .mutation(({ input, ctx }) => {
      // TODO: make this do something
      return {
        id: `${Math.random()}`,
        ...input,
      };
    }),
});

export type AppRouter = typeof appRouter;
