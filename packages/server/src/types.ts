import type { Model } from "mongoose";

export type ExtractModelType<T> = T extends Model<infer U> ? U : never;
