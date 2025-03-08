import { selectUserEntities } from "@/features/users/selectors";
import type { AppState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";
import { CommentWithReplies } from "../types";

export const selectCommentEntities = (state: AppState) =>
  state.comments.entities;

export function selectFeedbackComments(feedbackId: string) {
  return createSelector(
    [selectCommentEntities, selectUserEntities],
    (comments, users) => {
      const feedbackComments = comments.filter(
        (comment) => comment.feedbackId === feedbackId,
      );

      const commentById = new Map<string, CommentWithReplies>();
      feedbackComments.forEach((comment) => {
        commentById.set(comment.id, {
          ...comment,
          createdBy: users.find((user) => user.id === comment.createdBy)!,
          replies: [],
        });
      });

      const topLevelComments: CommentWithReplies[] = [];

      feedbackComments.forEach((comment) => {
        if (comment.parentComment == null) {
          topLevelComments.push(commentById.get(comment.id)!);
        } else {
          // For replies, determine the root (top-level) comment.
          let parentId = comment.parentComment;
          let topLevelCommentId = parentId;
          while (parentId) {
            const parent = commentById.get(parentId);
            if (!parent || parent.parentComment == null) {
              topLevelCommentId = parentId;
              break;
            }
            parentId = parent.parentComment;
          }
          // Attach the reply to the top-level comment's replies array.
          const topLevelComment = commentById.get(topLevelCommentId);
          if (topLevelComment) {
            topLevelComment.replies.push(commentById.get(comment.id)!);
          }
        }
      });

      return topLevelComments;
    },
  );
}
