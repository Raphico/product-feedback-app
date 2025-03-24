import type { FeedbackCategories, FeedbackStatuses } from "../config.js";

export type FeedbackResponseDto = {
  id: string;
  createdBy: string;
  title: string;
  detail: string;
  category: FeedbackCategories;
  status: FeedbackStatuses;
  upvotes: string[];
};

export type CreateFeedbackDto = {
  createdBy: string;
  title: string;
  category: FeedbackCategories;
  detail: string;
};
