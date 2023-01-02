import { Game } from "@common/model";
import { DBInterface } from "@common/router";
import { createPool, sql } from "slonik";

let instance: Awaited<ReturnType<typeof createPool>> | null = null;

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgres://botc:botc@localhost:7777/botc";

const db = async () => {
  if (!instance) {
    instance = await createPool(DATABASE_URL);
  }
  return instance;
};

// Create a table for storing game state. ID is a 6 character string and value is jsonb

const initDB = async () => {
  const pool = await db();
  await pool.query(sql.unsafe`CREATE TABLE IF NOT EXISTS game_state (
        id text PRIMARY KEY,
        value jsonb
    )`);
};

const getGameState = async (gameId: string) => {
  const pool = await db();
  const result = await pool.query(
    sql.unsafe`SELECT value FROM game_state WHERE id = ${gameId}`
  );
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0].value;
};

const upsertGameState = async (gameId: string, value: Game) => {
  const pool = await db();
  const stringified = JSON.stringify(value);
  await pool.query(
    sql.unsafe`INSERT INTO game_state (id, value) VALUES (${gameId}, ${stringified}) ON CONFLICT (id) DO UPDATE SET value = ${stringified}`
  );
};

export const DB: DBInterface =
  process.env.USE_DATABASE === "true"
    ? {
        initDB: initDB,
        getGameState,
        upsertGameState,
      }
    : {
        initDB: async () => {},
        getGameState: async () => null,
        upsertGameState: async () => {},
      };
