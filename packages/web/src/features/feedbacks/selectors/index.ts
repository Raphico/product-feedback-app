import type { AppState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectFeedbackEntities = (state: AppState) =>
  state.feedbacks.entities;
export const selectFeedbackIdParam = (_: AppState, id: string) => id;

export const selectSuggestions = createSelector(
  [selectFeedbackEntities],
  (entities) => entities.filter((feedback) => feedback.status === "suggestion"),
);

export const selectFeedbackRoadmapSummary = createSelector(
  [selectFeedbackEntities],
  (entities) =>
    entities.reduce(
      (accumulator, feedback) => {
        if (feedback.status === "live") {
          accumulator.live += 1;
        } else if (feedback.status === "in progress") {
          accumulator.inProgress += 1;
        } else if (feedback.status === "planned") {
          accumulator.planned += 1;
        }
        return accumulator;
      },
      { planned: 0, inProgress: 0, live: 0 },
    ),
);

export const selectFeedbackById = createSelector(
  [selectFeedbackEntities, selectFeedbackIdParam],
  (entities, id) => entities.find((feedback) => feedback.id == id),
);
