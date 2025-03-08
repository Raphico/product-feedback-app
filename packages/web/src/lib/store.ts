import { configureStore } from "@reduxjs/toolkit";
import { feedbacksReducers } from "@/features/feedbacks/slice";
import { commentsReducer } from "@/features/comments/slice";
import { usersReducer } from "@/features/users/slice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    feedbacks: feedbacksReducers,
    comments: commentsReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
