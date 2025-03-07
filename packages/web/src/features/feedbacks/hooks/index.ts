import { useAppSelector } from "@/lib/hooks";
import {
  selectSuggestions,
  selectFeedbackRoadmapSummary,
  selectFeedbackById,
} from "../selectors";

export function useRoadmapSummary() {
  return useAppSelector((state) => selectFeedbackRoadmapSummary(state));
}

export function useSuggestions() {
  return useAppSelector((state) => selectSuggestions(state));
}

export function useFeedbackById(id: string) {
  return useAppSelector((state) => selectFeedbackById(state, id));
}
