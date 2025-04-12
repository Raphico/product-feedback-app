import { createApi } from "@reduxjs/toolkit/query/react";
import type { Comment, CommentThreadResponse } from "./types";
import httpBaseQuery from "@/lib/http";
import { CreateCommentSchema } from "./validations";

const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/comments",
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query<CommentThreadResponse, string>({
      query: (feedbackId) => ({
        url: `?feedbackId=${feedbackId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    createComment: builder.mutation<
      Comment,
      CreateCommentSchema & { parentId?: string; feedbackId: string }
    >({
      query: (data) => ({ url: "/", method: "POST", data }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentApi;

export default commentApi;
