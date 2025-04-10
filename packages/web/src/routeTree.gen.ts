/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as CreateFeedbackImport } from "./routes/create-feedback";
import { Route as AuthRouteImport } from "./routes/_auth/route";
import { Route as IndexImport } from "./routes/index";
import { Route as FeedbackFeedbackIdImport } from "./routes/feedback.$feedbackId";
import { Route as AuthLoginImport } from "./routes/_auth/login";
import { Route as FeedbackFeedbackIdEditImport } from "./routes/feedback/$feedbackId/edit";

// Create/Update Routes

const CreateFeedbackRoute = CreateFeedbackImport.update({
  id: "/create-feedback",
  path: "/create-feedback",
  getParentRoute: () => rootRoute,
} as any);

const AuthRouteRoute = AuthRouteImport.update({
  id: "/_auth",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const FeedbackFeedbackIdRoute = FeedbackFeedbackIdImport.update({
  id: "/feedback/$feedbackId",
  path: "/feedback/$feedbackId",
  getParentRoute: () => rootRoute,
} as any);

const AuthLoginRoute = AuthLoginImport.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AuthRouteRoute,
} as any);

const FeedbackFeedbackIdEditRoute = FeedbackFeedbackIdEditImport.update({
  id: "/edit",
  path: "/edit",
  getParentRoute: () => FeedbackFeedbackIdRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/_auth": {
      id: "/_auth";
      path: "";
      fullPath: "";
      preLoaderRoute: typeof AuthRouteImport;
      parentRoute: typeof rootRoute;
    };
    "/create-feedback": {
      id: "/create-feedback";
      path: "/create-feedback";
      fullPath: "/create-feedback";
      preLoaderRoute: typeof CreateFeedbackImport;
      parentRoute: typeof rootRoute;
    };
    "/_auth/login": {
      id: "/_auth/login";
      path: "/login";
      fullPath: "/login";
      preLoaderRoute: typeof AuthLoginImport;
      parentRoute: typeof AuthRouteImport;
    };
    "/feedback/$feedbackId": {
      id: "/feedback/$feedbackId";
      path: "/feedback/$feedbackId";
      fullPath: "/feedback/$feedbackId";
      preLoaderRoute: typeof FeedbackFeedbackIdImport;
      parentRoute: typeof rootRoute;
    };
    "/feedback/$feedbackId/edit": {
      id: "/feedback/$feedbackId/edit";
      path: "/edit";
      fullPath: "/feedback/$feedbackId/edit";
      preLoaderRoute: typeof FeedbackFeedbackIdEditImport;
      parentRoute: typeof FeedbackFeedbackIdImport;
    };
  }
}

// Create and export the route tree

interface AuthRouteRouteChildren {
  AuthLoginRoute: typeof AuthLoginRoute;
}

const AuthRouteRouteChildren: AuthRouteRouteChildren = {
  AuthLoginRoute: AuthLoginRoute,
};

const AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(
  AuthRouteRouteChildren,
);

interface FeedbackFeedbackIdRouteChildren {
  FeedbackFeedbackIdEditRoute: typeof FeedbackFeedbackIdEditRoute;
}

const FeedbackFeedbackIdRouteChildren: FeedbackFeedbackIdRouteChildren = {
  FeedbackFeedbackIdEditRoute: FeedbackFeedbackIdEditRoute,
};

const FeedbackFeedbackIdRouteWithChildren =
  FeedbackFeedbackIdRoute._addFileChildren(FeedbackFeedbackIdRouteChildren);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "": typeof AuthRouteRouteWithChildren;
  "/create-feedback": typeof CreateFeedbackRoute;
  "/login": typeof AuthLoginRoute;
  "/feedback/$feedbackId": typeof FeedbackFeedbackIdRouteWithChildren;
  "/feedback/$feedbackId/edit": typeof FeedbackFeedbackIdEditRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "": typeof AuthRouteRouteWithChildren;
  "/create-feedback": typeof CreateFeedbackRoute;
  "/login": typeof AuthLoginRoute;
  "/feedback/$feedbackId": typeof FeedbackFeedbackIdRouteWithChildren;
  "/feedback/$feedbackId/edit": typeof FeedbackFeedbackIdEditRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/_auth": typeof AuthRouteRouteWithChildren;
  "/create-feedback": typeof CreateFeedbackRoute;
  "/_auth/login": typeof AuthLoginRoute;
  "/feedback/$feedbackId": typeof FeedbackFeedbackIdRouteWithChildren;
  "/feedback/$feedbackId/edit": typeof FeedbackFeedbackIdEditRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | ""
    | "/create-feedback"
    | "/login"
    | "/feedback/$feedbackId"
    | "/feedback/$feedbackId/edit";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | ""
    | "/create-feedback"
    | "/login"
    | "/feedback/$feedbackId"
    | "/feedback/$feedbackId/edit";
  id:
    | "__root__"
    | "/"
    | "/_auth"
    | "/create-feedback"
    | "/_auth/login"
    | "/feedback/$feedbackId"
    | "/feedback/$feedbackId/edit";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  AuthRouteRoute: typeof AuthRouteRouteWithChildren;
  CreateFeedbackRoute: typeof CreateFeedbackRoute;
  FeedbackFeedbackIdRoute: typeof FeedbackFeedbackIdRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRouteRoute: AuthRouteRouteWithChildren,
  CreateFeedbackRoute: CreateFeedbackRoute,
  FeedbackFeedbackIdRoute: FeedbackFeedbackIdRouteWithChildren,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_auth",
        "/create-feedback",
        "/feedback/$feedbackId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_auth": {
      "filePath": "_auth/route.tsx",
      "children": [
        "/_auth/login"
      ]
    },
    "/create-feedback": {
      "filePath": "create-feedback.tsx"
    },
    "/_auth/login": {
      "filePath": "_auth/login.tsx",
      "parent": "/_auth"
    },
    "/feedback/$feedbackId": {
      "filePath": "feedback.$feedbackId.tsx",
      "children": [
        "/feedback/$feedbackId/edit"
      ]
    },
    "/feedback/$feedbackId/edit": {
      "filePath": "feedback/$feedbackId/edit.tsx",
      "parent": "/feedback/$feedbackId"
    }
  }
}
ROUTE_MANIFEST_END */
