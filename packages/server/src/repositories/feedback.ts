import type { FeedbackCategories } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";
import type { FeedbackRepository } from "./feedback.interface.js";
import type { UpdateQuery } from "mongoose";
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
  async findById(id: string): Promise<FeedbackEntity | null> {
    const feedback = await Feedback.findOne({ _id: id });
    if (!feedback) return null;
    return feedback;
  },
  async update(
    id: string,
    data: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackEntity | null> {
    return Feedback.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  },
};
