import type { FeedbackCategories, FeedbackStatuses } from "../../config.js";

export type FeedbackResponseDto = {
  id: string;
  createdBy: string;
  title: string;
  detail: string;
  category: FeedbackCategories;
  status: FeedbackStatuses;
};

export type ExtendedFeedbackResponseDto = FeedbackResponseDto & {
  upvoteCount: number;
  hasUpvote: boolean;
  commentCount: number;
};
