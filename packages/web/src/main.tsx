import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./lib/store";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import Toaster from "./components/toast";
import NotFound from "./components/not-found";

const router = createRouter({
  routeTree,
  defaultStaleTime: Infinity,
  defaultNotFoundComponent: () => (
    <NotFound
      link="/"
      linkText="Go home"
      description="The page you’re looking for might have been removed, renamed, or never existed."
      title="Oops! We couldn’t find that page"
    />
  ),
  context: {
    store,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster />
      </Provider>
    </StrictMode>,
  );
}
