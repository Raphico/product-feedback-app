import { AppState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectUser = (state: AppState) => state.user;

export const selectIsLoggedIn = createSelector(
  [selectUser],
  (user) => !!user.data,
);
