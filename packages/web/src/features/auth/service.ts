import { createApi } from "@reduxjs/toolkit/query/react";
import httpBaseQuery from "@/lib/http";
import { User } from "../user/types";
import { LoginSchema } from "./validations";
import { setUser } from "../user/slice";
import feedbackApi from "../feedbacks/service";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/auth",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginSchema>({
      query: (data) => ({ url: "/login", method: "POST", data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser(data));
          dispatch(feedbackApi.util.invalidateTags(["Feedback"]));
        } catch {
          console.error("Login failed");
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
export default authApi;
