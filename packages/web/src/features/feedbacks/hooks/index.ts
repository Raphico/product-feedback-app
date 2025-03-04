import { useAppSelector } from "@/lib/hooks";
import { selectRoadmapSummary, selectSuggestions } from "../slice";

function useRoadmapSummary() {
  return useAppSelector((state) =>
    selectRoadmapSummary({ feedbacks: state.productFeedbacks }),
  );
}

function useSuggestions() {
  return useAppSelector((state) =>
    selectSuggestions({ feedbacks: state.productFeedbacks }),
  );
}

export { useRoadmapSummary, useSuggestions };
