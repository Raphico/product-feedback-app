import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import type { Config } from "../config.js";

export async function initDB(config: Config) {
  const pool = new Pool({
    connectionString: config.databaseUrl,
  });

  const db = drizzle({ client: pool, schema });

  return { db, pool };
}

export type DB = Awaited<ReturnType<typeof initDB>>["db"];

export async function shutdownDB(pool: Pool) {
  await pool.end();
}
