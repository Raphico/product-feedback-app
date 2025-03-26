import type { UpdateQuery } from "mongoose";
import type { FeedbackCategories } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";

export interface FeedbackWithCommentCount extends FeedbackEntity {
  commentCount: number;
}

export interface FeedbackRepository {
  create(data: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackEntity>;
  findById(id: string): Promise<FeedbackEntity | null>;
  findMany(
    data?: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackWithCommentCount[]>;
  getFeedbackCommentCount(feedbackId: string): Promise<number>;
  update(
    id: string,
    data: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackEntity | null>;
}
