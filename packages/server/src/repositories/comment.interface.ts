import type { CommentEntity } from "../models/comment.js";

export interface CommentRepository {
  create(comment: {
    createdBy: string;
    content: string;
    feedbackId: string;
    parentId?: string;
  }): Promise<CommentEntity>;
  findById(id: string): Promise<CommentEntity | null>;
  findMany(feedbackId: string): Promise<CommentEntity[]>;
}
