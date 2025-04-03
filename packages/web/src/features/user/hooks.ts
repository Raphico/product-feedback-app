import { useAppSelector } from "@/lib/store";
import { selectIsLoggedIn, selectUser } from "./selectors";

export function useIsLoggedIn() {
  return useAppSelector((state) => selectIsLoggedIn(state));
}

export function useUser() {
  return useAppSelector((state) => selectUser(state));
}
