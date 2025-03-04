import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { Feedback } from "@/types";
import data from "@/assets/data.json";

type FeedbacksState = {
  entities: Feedback[];
};

const initialState: FeedbacksState = {
  entities: data.feedbacks as Feedback[],
};

const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {},
  selectors: {
    selectSuggestions: createSelector(
      (state: FeedbacksState) => state.entities,
      (entities) => {
        return entities.filter((feedback) => feedback.status == "suggestion");
      },
    ),
    selectRoadmapSummary: createSelector(
      (state: FeedbacksState) => state.entities,
      (entities) => {
        return entities.reduce(
          (accumulator, feedback: Feedback) => {
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
    ),
  },
});

export const feedbacksReducers = feedbacksSlice.reducer;
export const { selectRoadmapSummary, selectSuggestions } =
  feedbacksSlice.selectors;

export default feedbacksSlice;
