import { createApi } from "@reduxjs/toolkit/query/react";
import type { Feedback, GetFeedbacksParams, FeedbackStats } from "./types";
import httpBaseQuery from "@/lib/http";
import type { CreateFeedbackSchema, EditFeedbackSchema } from "./validations";
import { FeedbackStatuses } from "@/config";

export const ROADMAP_FILTER = {
  status: [
    FeedbackStatuses.PLANNED,
    FeedbackStatuses.IN_PROGRESS,
    FeedbackStatuses.LIVE,
  ],
} as const;

const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/feedbacks",
  }),
  tagTypes: ["Feedback", "FeedbackStats"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getFeedbacks: builder.query<Feedback[], GetFeedbacksParams | void>({
      query: (params) => ({
        url: "/",
        method: "GET",
        params: params ? { ...params, status: params.status?.join(",") } : {},
      }),
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
      providesTags: ["FeedbackStats"],
    }),
    getFeedback: builder.query<Feedback, string>({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: (result, _, id) =>
        result ? [{ type: "Feedback", id }] : [],
    }),
    createFeedback: builder.mutation<Feedback, CreateFeedbackSchema>({
      query: (data) => ({ url: "/", method: "POST", data }),
      invalidatesTags: ["Feedback"],
    }),
    updateFeedback: builder.mutation<
      Feedback,
      { id: string; _optimistic?: boolean } & Partial<EditFeedbackSchema>
    >({
      query: ({ id, _optimistic = false, ...data }) => ({
        url: `/${id}`,
        method: "PATCH",
        data,
      }),
      async onQueryStarted(
        { id, _optimistic, ...patch },
        { dispatch, queryFulfilled, getState },
      ) {
        if (_optimistic) {
          const patchList = [];

          for (const {
            endpointName,
            originalArgs,
          } of feedbackApi.util.selectInvalidatedBy(getState(), [
            { type: "Feedback", id },
          ])) {
            if (endpointName !== "getFeedbacks") continue;

            const patchItem = dispatch(
              feedbackApi.util.updateQueryData(
                "getFeedbacks",
                originalArgs,
                (draft) => {
                  const feedback = draft.find((f) => f.id === id);
                  if (feedback) {
                    Object.assign(feedback, patch);
                  }
                },
              ),
            );

            patchList.push(patchItem);
          }

          try {
            await queryFulfilled;
          } catch {
            patchList.forEach((patch) => patch.undo());
          }
        }
      },
      invalidatesTags: (result, _, { id, status }) => {
        const tags: any[] = [{ type: "Feedback", id }, "Feedback"];
        if (status) {
          tags.push("FeedbackStats");
        }
        return result ? tags : [];
      },
    }),
    deleteFeedback: builder.mutation<Feedback, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Feedback"],
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
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useToggleUpvoteMutation,
  useDeleteFeedbackMutation,
} = feedbackApi;

export default feedbackApi;
