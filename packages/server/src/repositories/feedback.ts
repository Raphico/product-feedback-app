import type { FeedbackCategories } from "../config.js";
import type { FeedbackResponseDto } from "../dtos/feedback.js";
import { feedbackToDto } from "../mappers/feedback.js";
import { Feedback } from "../models/feedback.js";

export const feedbackRepository = {
  async create(feedback: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackResponseDto> {
    const createdFeedback = await Feedback.create(feedback);
    return feedbackToDto(createdFeedback);
  },
};
