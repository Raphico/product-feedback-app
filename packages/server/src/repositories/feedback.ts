import type { FeedbackCategories } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";
import type { FeedbackRepository } from "./feedback.interface.js";
import { Feedback } from "../models/feedback.js";

export const feedbackRepository: FeedbackRepository = {
  async create(feedback: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackEntity> {
    return Feedback.create(feedback);
  },
};
