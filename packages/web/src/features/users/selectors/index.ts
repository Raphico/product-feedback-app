import { AppState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectUserEntities = (state: AppState) => state.users.entities;
export const selectUserIdParam = (_: AppState, id: string) => id;

export const selectUserById = createSelector(
  [selectUserEntities, selectUserIdParam],
  (entities, id) => entities.find((user) => user.id == id),
);
