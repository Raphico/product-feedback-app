import CreateFeedbackPage from "@/features/feedbacks/pages/create-feedback";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/create-feedback")({
  beforeLoad: ({ context: { store } }) => {
    const isLoggedIn = !!store.getState().user.data;
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: `/create-feedback`,
        },
      });
    }
  },
  component: CreateFeedbackPage,
});
