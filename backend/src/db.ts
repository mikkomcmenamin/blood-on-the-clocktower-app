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
  // add an updated_at column that defaults to now if null
  await pool.query(
    sql.unsafe`ALTER TABLE game_state ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now()`
  );
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
  const updatedAt = new Date().toISOString();
  await pool.query(
    sql.unsafe`INSERT INTO game_state (id, value, updated_at) VALUES (${gameId}, ${stringified}, ${updatedAt}) ON CONFLICT (id) DO UPDATE SET value = ${stringified}
    , updated_at = ${updatedAt}`
  );
};

const deleteGame = async (gameId: string) => {
  const pool = await db();
  await pool
    .query(sql.unsafe`DELETE FROM game_state WHERE id = ${gameId}`)
    .catch((e) => {
      console.error(e);
    });
};

const deleteGamesNotUpdatedSince = async (ts: number) => {
  const pool = await db();
  const deletedIDs = await pool
    .query(
      sql.unsafe`DELETE FROM game_state WHERE updated_at < ${new Date(
        ts
      ).toISOString()}
      RETURNING id`
    )
    .catch((e) => {
      console.error(e);
      return { rowCount: 0, rows: [] };
    });

  if (deletedIDs.rowCount > 0) {
    console.log(`Deleted ${deletedIDs.rowCount} games`);
    return deletedIDs.rows.map((row) => row.id);
  }

  return [];
};

export const DB: DBInterface =
  process.env.USE_DATABASE === "true"
    ? {
        initDB: initDB,
        getGameState,
        upsertGameState,
        deleteGame,
        deleteGamesNotUpdatedSince,
      }
    : {
        initDB: async () => {},
        getGameState: async () => null,
        upsertGameState: async () => {},
        deleteGame: async () => {},
        deleteGamesNotUpdatedSince: async () => [],
      };
