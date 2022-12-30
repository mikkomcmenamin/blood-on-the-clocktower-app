import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { gameActionSchema, gameStateReducer } from "./gameLogic";
import { Game, initialGameState } from "./model";

const e = new EventEmitter();

export function createContext(
  _: CreateHTTPContextOptions | CreateWSSContextFnOptions
) {
  return {};
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

export const createAppRouter = () => {
  // todo namespace the games, right now just one server state
  // todo this shouldn't be in common

  let serverState: Game = initialGameState;

  return router({
    onHeartbeat: publicProcedure.subscription(() => {
      console.log("Got subscription to heartbeat");
      return observable<"pong">((emit) => {
        const interval = setInterval(() => {
          emit.next("pong");
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      });
    }),
    onGameAction: publicProcedure.subscription(() => {
      return observable<Game>((emit) => {
        console.log("Got subscription to game action");
        const listener = (game: Game) => {
          emit.next(game);
        };
        listener(serverState);
        e.on("game", listener);
        return () => {
          e.off("game", listener);
        };
      });
    }),
    gameAction: publicProcedure
      .input(gameActionSchema)
      .mutation(({ input, ctx: _ }) => {
        // console.log("Got game action", input);
        serverState = gameStateReducer(serverState, input);
        e.emit("game", serverState);
        return "ok";
      }),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
