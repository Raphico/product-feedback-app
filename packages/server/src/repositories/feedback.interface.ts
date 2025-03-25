import type { FeedbackCategories } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";

export interface FeedbackRepository {
  create(data: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackEntity>;
}
