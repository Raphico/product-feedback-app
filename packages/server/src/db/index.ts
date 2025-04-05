import mongoose from "mongoose";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import type { Config } from "../config.js";

export async function initDB(config: Config) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle({ client: pool, schema });
  await mongoose.connect(config.databaseUrl);

  return { db, pool };
}

export type DB = Awaited<ReturnType<typeof initDB>>["db"];

export async function shutdownDB(pool: Pool) {
  await pool.end();
}
