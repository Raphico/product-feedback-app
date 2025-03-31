import { useAppSelector } from "@/lib/store";
import { selectIsLoggedIn } from "./selectors";

export function useIsLoggedIn() {
  return useAppSelector((state) => selectIsLoggedIn(state));
}
