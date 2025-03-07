import type { AppState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectComments = (state: AppState) => state.comments.entities;
export const selectCommentIdParam = (_: AppState, id: string) => id;

export const selectCommentById = createSelector(
  [selectComments, selectCommentIdParam],
  (entities, id) => entities.find((comment) => comment.id == id),
);
