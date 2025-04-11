import { createApi } from "@reduxjs/toolkit/query/react";
import httpBaseQuery from "@/lib/http";
import { User } from "../user/types";
import { LoginSchema } from "./validation";
import { setUser } from "../user/slice";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/auth",
  }),
  tagTypes: ["Feedback", "Comment"],
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginSchema>({
      query: (data) => ({ url: "/login", method: "POST", data }),
      invalidatesTags: ["Feedback", "Comment"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser(data));
        } catch {
          console.error("Login failed");
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
export default authApi;
