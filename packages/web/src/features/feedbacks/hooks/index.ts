import { useAppSelector } from "@/lib/hooks";
import { selectSuggestions, selectRoadmapSummary } from "../selectors";

function useRoadmapSummary() {
  return useAppSelector((state) => selectRoadmapSummary(state));
}

function useSuggestions() {
  return useAppSelector((state) => selectSuggestions(state));
}

export { useRoadmapSummary, useSuggestions };
