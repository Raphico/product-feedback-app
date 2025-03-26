import type { UpdateQuery } from "mongoose";
import type { FeedbackCategories } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";

export interface FeedbackRepository {
  create(data: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackEntity>;
  findById(id: string): Promise<FeedbackEntity | null>;
  getFeedbackCommentCount(feedbackId: string): Promise<number>;
  update(
    id: string,
    data: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackEntity | null>;
}
