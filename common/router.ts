import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { GameAction, gameActionSchema, gameStateReducer } from "./gameLogic";
import { Game, initialGameState } from "./model";

// FIXME: really damn stupid that this is in common
// The client only needs the AppRouter type, the rest is all server stuff.

type Event = `game-${string}`;
type Payload<E extends Event> = E extends `game-${infer GameId}`
  ? { game: Game; input?: GameAction; gameId: GameId }
  : never;

class TypesafeEventEmitter extends EventEmitter {
  emit<E extends Event>(event: E, payload: Payload<E>): boolean {
    return super.emit(event, payload);
  }
  on<E extends Event>(event: E, listener: (payload: Payload<E>) => void): this {
    return super.on(event, listener);
  }
  off<E extends Event>(
    event: E,
    listener: (payload: Payload<E>) => void
  ): this {
    return super.off(event, listener);
  }
}

const e = new TypesafeEventEmitter();

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

  const serverState: Record<string, Game> = {};
  const gameStateUpdatedAt = new Map<string, number>();

  // Run an interval that checks all games for inactivity (2 hours) and deletes them
  setInterval(() => {
    const now = Date.now();
    for (const [gameId, updatedAt] of gameStateUpdatedAt) {
      if (now - updatedAt > 1000 * 60 * 60 * 2) {
        console.log(`Deleting game ${gameId} due to inactivity`);
        delete serverState[gameId];
        gameStateUpdatedAt.delete(gameId);
      }
    }
  }, 1000 * 60 /* every minute */);

  const getOrCreateGame = (gameId: string) => {
    if (!serverState[gameId]) {
      serverState[gameId] = initialGameState;
    }
    return serverState[gameId];
  };

  return router({
    onGameAction: publicProcedure
      .input(z.object({ gameId: z.string().length(6) }))
      .subscription(({ input: { gameId } }) => {
        return observable<{ game: Game; gameId: string; input?: GameAction }>(
          (emit) => {
            console.log(`Subscribed to game actions for game ${gameId}`);
            const listener = (gameAndAction: {
              game: Game;
              input?: GameAction;
            }) => {
              emit.next({ ...gameAndAction, gameId });
            };
            listener({ game: getOrCreateGame(gameId) });
            e.on(`game-${gameId}`, listener);
            return () => {
              e.off(`game-${gameId}`, listener);
            };
          }
        );
      }),
    gameAction: publicProcedure
      .input(
        z.object({ action: gameActionSchema, gameId: z.string().length(6) })
      )
      .mutation(({ input, ctx: _ }) => {
        // console.log("Got game action", input);
        const gameState = getOrCreateGame(input.gameId);
        serverState[input.gameId] = gameStateReducer(gameState, input.action);
        gameStateUpdatedAt.set(input.gameId, Date.now());
        e.emit(`game-${input.gameId}`, {
          game: serverState[input.gameId],
          input: input.action,
          gameId: input.gameId,
        });
        return "ok";
      }),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
