import { createApi } from "@reduxjs/toolkit/query/react";
import type { Comment, CommentThreadResponse } from "./types";
import httpBaseQuery from "@/lib/http";
import { CreateCommentSchema } from "./validations";
import feedbackApi from "../feedbacks/service";

const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/comments",
  }),
  tagTypes: ["Comment"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getComments: builder.query<CommentThreadResponse, string>({
      query: (feedbackId) => ({
        url: `?feedbackId=${feedbackId}`,
        method: "GET",
      }),
      providesTags: (result, _, feedbackId) =>
        result ? [{ type: "Comment", id: feedbackId }] : [],
    }),
    createComment: builder.mutation<
      Comment,
      CreateCommentSchema & { parentId?: string; feedbackId: string }
    >({
      query: (data) => ({ url: "/", method: "POST", data }),
      async onQueryStarted({ feedbackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            feedbackApi.util.invalidateTags([
              { type: "Feedback", id: feedbackId },
            ]),
          );
        } catch {
          /* empty */
        }
      },
      invalidatesTags: (result, _, data) =>
        result ? [{ type: "Comment", id: data.feedbackId }] : [],
    }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentApi;

export default commentApi;
