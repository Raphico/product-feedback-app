export enum FeedbackCategories {
  UI = "ui",
  UX = "ux",
  FEATURE = "feature",
  BUG = "bug",
  ENHANCEMENT = "enhancement",
}

export enum FeedbackStatuses {
  SUGGESTION = "suggestion",
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  LIVE = "live",
}

export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export const feedbackCategories = [
  "All",
  "UI",
  "UX",
  "Enhancement",
  "Bug",
  "Feature",
] as const;
