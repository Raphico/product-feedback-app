import { createApi } from "@reduxjs/toolkit/query/react";
import type { Feedback, GetFeedbacksParams, FeedbackStats } from "./types";
import httpBaseQuery from "@/lib/http";

const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/feedbacks",
  }),
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    getFeedbacks: builder.query<Feedback[], GetFeedbacksParams | void>({
      query: (params) => ({ url: "/", method: "GET", params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Feedback" as const, id })),
              "Feedback",
            ]
          : ["Feedback"],
    }),
    getFeedbackStats: builder.query<FeedbackStats, void>({
      query: () => ({ url: "/stats", method: "GET" }),
    }),
    getFeedback: builder.query<Feedback, string>({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: (result, _, id) =>
        result ? [{ type: "Feedback", id }] : [],
    }),
    toggleUpvote: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}/upvotes`, method: "PATCH" }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchList = [];

        for (const {
          endpointName,
          originalArgs,
        } of feedbackApi.util.selectInvalidatedBy(getState(), [
          { type: "Feedback", id },
        ])) {
          if (endpointName !== "getFeedbacks") continue;

          const patch = dispatch(
            feedbackApi.util.updateQueryData(
              "getFeedbacks",
              originalArgs,
              (draft) => {
                const feedback = draft.find((f) => f.id === id);
                if (feedback) {
                  feedback.hasUpvote = !feedback.hasUpvote;
                  feedback.upvoteCount += feedback.hasUpvote ? 1 : -1;
                }
              },
            ),
          );

          patchList.push(patch);
        }

        const patchDetail = dispatch(
          feedbackApi.util.updateQueryData("getFeedback", id, (draft) => {
            if (draft) {
              draft.hasUpvote = !draft.hasUpvote;
              draft.upvoteCount += draft.hasUpvote ? 1 : -1;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.forEach((patch) => patch.undo());
          patchDetail.undo();
        }
      },
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useGetFeedbackStatsQuery,
  useGetFeedbackQuery,
  useToggleUpvoteMutation,
} = feedbackApi;

export default feedbackApi;
