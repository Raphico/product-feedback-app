import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userReducer } from "@/features/user/slice";
import userApi from "@/features/user/service";
import feedbackApi from "@/features/feedbacks/service";
import commentApi from "@/features/comments/service";
import authApi from "@/features/auth/service";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      feedbackApi.middleware,
      commentApi.middleware,
      authApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
