import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "./types";
import httpBaseQuery from "@/lib/http";
import { clearUser, setUser } from "./slice";
import { UpdateAvatarSchema, UserSchema } from "./validation";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/users",
  }),
  refetchOnReconnect: true,
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
    updateMe: builder.mutation<User, Omit<UserSchema, "email">>({
      query: (data) => ({ url: "/me", method: "PATCH", data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          /* empty */
        }
      },
    }),
    updateAvatar: builder.mutation<User, UpdateAvatarSchema>({
      query: (data) => {
        const formData = new FormData();
        if (data.avatar) formData.append("avatar", data.avatar);

        return {
          url: "/me/avatar",
          method: "PATCH",
          data: formData,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          /* empty */
        }
      },
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation, useUpdateAvatarMutation } =
  userApi;
export default userApi;
