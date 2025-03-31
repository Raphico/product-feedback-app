import { store, AppDispatch, AppState } from "./setup";
import { useAppDispatch, useAppSelector } from "./hooks";

export type { AppState, AppDispatch };
export { useAppDispatch, useAppSelector };
export default store;
