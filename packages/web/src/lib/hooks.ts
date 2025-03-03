import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, AppState } from "./store";

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export { useAppSelector, useAppDispatch };
