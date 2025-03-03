import { configureStore } from "@reduxjs/toolkit";
import { productRequestsReducers } from "../features/product-requests-slice";
import { commentsReducer } from "../features/comments-slice";

const store = configureStore({
  reducer: {
    productRequests: productRequestsReducers,
    comments: commentsReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
