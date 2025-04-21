import AccountPage from "@/features/user/pages/account";
import { redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  beforeLoad: ({ context: { store } }) => {
    const isLoggedIn = !!store.getState().user.data;
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: "/account",
        },
      });
    }
  },
  component: AccountPage,
});
