import mongoose from "mongoose";
import type { Config } from "../config.js";

export async function initDB(config: Config) {
  await mongoose.connect(config.databaseUrl);
}

export async function shutdownDB() {
  await mongoose.disconnect();
}
