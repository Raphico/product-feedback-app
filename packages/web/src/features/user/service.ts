import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "./types";
import httpBaseQuery from "@/lib/http";
import { clearUser, setUser } from "./slice";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/users",
  }),
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({ url: "/me", method: "GET" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(clearUser());
        }
      },
    }),
  }),
});

export const { useGetMeQuery } = userApi;
export default userApi;
