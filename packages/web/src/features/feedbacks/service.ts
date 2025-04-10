import { createApi } from "@reduxjs/toolkit/query/react";
import type { Feedback, GetFeedbacksParams, FeedbackStats } from "./types";
import httpBaseQuery from "@/lib/http";

const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/feedbacks",
  }),
  endpoints: (builder) => ({
    getFeedbacks: builder.query<Feedback[], GetFeedbacksParams | void>({
      query: (params) => ({ url: "/", method: "GET", params }),
    }),
    getFeedbackStats: builder.query<FeedbackStats, void>({
      query: () => ({ url: "/stats", method: "GET" }),
    }),
    getFeedback: builder.query<Feedback, string>({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useGetFeedbackStatsQuery,
  useGetFeedbackQuery,
} = feedbackApi;

export default feedbackApi;
