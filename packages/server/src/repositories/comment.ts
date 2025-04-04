import type { CommentRepository } from "./comment.interface.js";
import { Comment, type CommentEntity } from "../models/comment.js";

export const commentRepository: CommentRepository = {
  create(comment: {
    createdBy: string;
    content: string;
    feedbackId: string;
    parentId?: string;
  }): Promise<CommentEntity> {
    return Comment.create(comment);
  },
  async findById(id: string): Promise<CommentEntity | null> {
    const comment = await Comment.findOne({ _id: id }).populate({
      path: "createdBy",
      select: "username fullName avatar role",
    });
    if (!comment) return null;
    return comment;
  },
  async findMany(feedbackId: string): Promise<CommentEntity[]> {
    return Comment.find({ feedbackId }).populate({
      path: "createdBy",
      select: "username fullName avatar role",
    });
  },
};
