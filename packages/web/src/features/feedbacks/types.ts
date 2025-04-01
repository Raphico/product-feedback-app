import type { FeedbackCategories, FeedbackStatuses } from "@/config";

export type Feedback = {
  id: string;
  title: string;
  category: FeedbackCategories;
  upvotes: string[];
  status: FeedbackStatuses;
  detail: string;
  createdBy: string;
  commentCount: number;
};

export type GetFeedbacksParams = {
  status?: FeedbackStatuses;
  categories?: FeedbackCategories;
};

export type FeedbackStats = {
  in_progress: number;
  planned: number;
  live: number;
};
