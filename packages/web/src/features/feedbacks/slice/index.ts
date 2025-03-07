import { createSlice } from "@reduxjs/toolkit";
import type { Feedback } from "../types";
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
});

export const feedbacksReducers = feedbacksSlice.reducer;

export default feedbacksSlice;
