export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export enum FeedbackCategories {
  UI = "ui",
  UX = "ux",
  FEATURE = "feature",
  BUG = "bug",
  ENHANCEMENT = "enhancement",
}

export enum FeedbackSortOptions {
  MOST_UPVOTES = "most_upvotes",
  LEAST_UPVOTES = "least_upvotes",
  MOST_COMMENTS = "most_comments",
  LEAST_COMMENTS = "least_comments",
}

export enum FeedbackStatuses {
  SUGGESTION = "suggestion",
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  LIVE = "live",
}

export const feedbackCategoryOptions = [
  { label: "UI", value: FeedbackCategories.UI },
  { label: "UX", value: FeedbackCategories.UX },
  { label: "Enhancement", value: FeedbackCategories.ENHANCEMENT },
  { label: "Bug", value: FeedbackCategories.BUG },
  { label: "Feature", value: FeedbackCategories.FEATURE },
];

export const feedbackSortOptions = [
  { label: "Most Upvotes", value: FeedbackSortOptions.MOST_UPVOTES },
  { label: "Least Upvotes", value: FeedbackSortOptions.LEAST_UPVOTES },
  { label: "Most Comments", value: FeedbackSortOptions.MOST_COMMENTS },
  { label: "Least Comments", value: FeedbackSortOptions.LEAST_COMMENTS },
];
