import type {
  FeedbackCategories,
  FeedbackSortOptions,
  FeedbackStatuses,
} from "@/config";

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
  category?: FeedbackCategories;
  sort?: FeedbackSortOptions;
};

export type FeedbackStats = {
  in_progress: number;
  planned: number;
  live: number;
};
