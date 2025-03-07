import { configureStore } from "@reduxjs/toolkit";
import { feedbacksReducers } from "@/features/feedbacks/slice";
import { commentsReducer } from "@/features/comments/slice";

const store = configureStore({
  reducer: {
    feedbacks: feedbacksReducers,
    comments: commentsReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
