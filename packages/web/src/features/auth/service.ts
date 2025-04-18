import { createApi } from "@reduxjs/toolkit/query/react";
import httpBaseQuery from "@/lib/http";
import { User } from "../user/types";
import {
  EmailSchema,
  LoginSchema,
  ResetPasswordSchema,
  SignupSchema,
  VerifyEmailSchema,
} from "./validations";
import { clearUser, setUser } from "../user/slice";
import feedbackApi from "../feedbacks/service";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: httpBaseQuery({
    baseUrl: "/auth",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<User, SignupSchema>({
      query: (data) => ({ url: "/signup", method: "POST", data }),
    }),
    verifyEmail: builder.mutation<void, VerifyEmailSchema>({
      query: (data) => ({ url: "/verification", method: "POST", data }),
    }),
    resendEmailVerification: builder.mutation<void, EmailSchema>({
      query: (data) => ({ url: "/resend-verification", method: "POST", data }),
    }),
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
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/logout", method: "POST" }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(clearUser());
        } catch {
          /* empty */
        }
      },
    }),
    forgotPassword: builder.mutation<void, EmailSchema>({
      query: (data) => ({
        url: "/request-password-reset",
        method: "POST",
        data,
      }),
    }),
    resetPassword: builder.mutation<
      void,
      ResetPasswordSchema & { token: string }
    >({
      query: ({ token, ...data }) => ({
        url: `/password-reset/${token}`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyEmailMutation,
  useResendEmailVerificationMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
export default authApi;
