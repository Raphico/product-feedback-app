import { store, type AppDispatch, type AppState, type Store } from "./setup";
import { useAppDispatch, useAppSelector } from "./hooks";

export type { AppState, AppDispatch, Store };
export { useAppDispatch, useAppSelector };
export default store;
