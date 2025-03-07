import { AppState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectFeedbacks = (state: AppState) => state.feedbacks.entities;

export const selectSuggestions = createSelector(
  [selectFeedbacks],
  (feedbacks) =>
    feedbacks.filter((feedback) => feedback.status == "suggestion"),
);

export const selectRoadmapSummary = createSelector(
  [selectFeedbacks],
  (feedbacks) => {
    return feedbacks.reduce(
      (accumulator, feedback) => {
        if (feedback.status == "live") {
          accumulator.live += 1;
        } else if (feedback.status == "in progress") {
          accumulator.inProgress += 1;
        } else if (feedback.status == "planned") {
          accumulator.planned += 1;
        }
        return accumulator;
      },
      { planned: 0, inProgress: 0, live: 0 },
    );
  },
);
