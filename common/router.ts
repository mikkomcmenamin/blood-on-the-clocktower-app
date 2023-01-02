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

export type DBInterface = {
  initDB: () => Promise<void>;
  getGameState: (gameId: string) => Promise<Game | null>;
  upsertGameState: (gameId: string, game: Game) => Promise<void>;
};

const gamesToFlush: string[] = [];

export function createContext(
  _: CreateHTTPContextOptions | CreateWSSContextFnOptions
) {
  return {};
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

export const createAppRouter = async (db: DBInterface) => {
  // todo namespace the games, right now just one server state
  // todo this shouldn't be in common

  await db.initDB();

  setInterval(async () => {
    const queue = gamesToFlush.splice(0, gamesToFlush.length);
    for (const gameId of queue) {
      const game = serverState[gameId];
      if (!game) {
        continue;
      }
      await db.upsertGameState(gameId, game).catch((err) => {
        console.error(`Error saving game ${gameId} to DB`, err);
      });
    }
  }, 1000);

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

  const getOrCreateGame = async (gameId: string) => {
    if (!serverState[gameId]) {
      const game = await db.getGameState(gameId);
      console.log(`Got game ${gameId} from DB`, game);
      if (!game) {
        serverState[gameId] = initialGameState;
        gamesToFlush.push(gameId);
      } else {
        serverState[gameId] = game;
      }
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

            void getOrCreateGame(gameId).then((game) => listener({ game }));
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
      .mutation(async ({ input, ctx: _ }) => {
        // console.log("Got game action", input.action.type);
        const gameState = await getOrCreateGame(input.gameId);
        serverState[input.gameId] = gameStateReducer(gameState, input.action);
        gameStateUpdatedAt.set(input.gameId, Date.now());
        gamesToFlush.push(input.gameId);
        e.emit(`game-${input.gameId}`, {
          game: serverState[input.gameId],
          input: input.action,
          gameId: input.gameId,
        });
        return "ok";
      }),
  });
};

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
