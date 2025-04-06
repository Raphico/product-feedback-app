import type {
  FeedbackCategories,
  FeedbackSortOptions,
  FeedbackStatuses,
} from "@/config";

export type Feedback = {
  id: string;
  title: string;
  category: FeedbackCategories;
  status: FeedbackStatuses;
  detail: string;
  createdBy: string;
  commentCount: number;
  upvoteCount: number;
  hasUpvote: boolean;
};

export type GetFeedbacksParams = {
  status?: FeedbackStatuses;
  category?: FeedbackCategories;
  sort?: FeedbackSortOptions;
};

export type FeedbackStats = {
  inProgress: number;
  planned: number;
  live: number;
};
