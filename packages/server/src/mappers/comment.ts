import { Types } from "mongoose";
import { CommentResponseDto } from "../dtos/comment.js";
import type { CommentEntity } from "../models/comment.js";
import { InternalServerError } from "../errors/common.js";
import { fromObjectId } from "../utils/object-id.js";

export function commentToDto(comment: CommentEntity): CommentResponseDto {
  if (comment.createdBy instanceof Types.ObjectId) {
    throw new InternalServerError("CreateBy isn't populated with user data");
  }

  return {
    id: fromObjectId(comment._id),
    content: comment.content,
    parentId: comment.parentId ? fromObjectId(comment.parentId) : null,
    feedbackId: fromObjectId(comment.feedbackId),
    createdBy: {
      id: fromObjectId(comment.createdBy._id),
      fullName: comment.createdBy.fullName,
      username: comment.createdBy.username,
      avatar: comment.createdBy.avatar,
    },
  };
}
