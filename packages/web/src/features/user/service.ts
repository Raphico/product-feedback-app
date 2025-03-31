import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "./types";
import httpBaseQuery from "@/lib/http";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/users",
  }),
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({ url: "/me", method: "get" }),
    }),
  }),
});

export const { useGetMeQuery } = userApi;
export default userApi;
