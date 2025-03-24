import { FeedbackCategories } from "../config.js";
import { FeedbackResponseDto } from "../dtos/feedback.js";

export interface FeedbackRepository {
  create(data: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackResponseDto>;
}
