import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { feedbacksReducers } from "@/features/feedbacks/slice";
import { commentsReducer } from "@/features/comments/slice";
import { userReducer } from "@/features/user/slice";
import userApi from "@/features/user/service";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    feedbacks: feedbacksReducers,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

setupListeners(store.dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
