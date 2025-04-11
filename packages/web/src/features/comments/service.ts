import { createApi } from "@reduxjs/toolkit/query/react";
import type { Comment } from "./types";
import httpBaseQuery from "@/lib/http";

const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/comments",
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      query: (feedbackId) => ({
        url: `?feedbackId=${feedbackId}`,
        method: "GET",
        providesTags: ["Comment"],
      }),
    }),
  }),
});

export const { useGetCommentsQuery } = commentApi;

export default commentApi;
