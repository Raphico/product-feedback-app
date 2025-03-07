import { useAppSelector } from "@/lib/hooks";
import { selectCommentById } from "../selectors";

export function useCommentById(id: string) {
  return useAppSelector((state) => selectCommentById(state, id));
}
