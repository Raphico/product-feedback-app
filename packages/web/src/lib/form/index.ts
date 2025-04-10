import { lazy } from "react";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./context";

const FormInput = lazy(() =>
  import("@/components/form.tsx").then((module) => ({
    default: module.FormInput,
  })),
);
const FormTextarea = lazy(() =>
  import("@/components/form.tsx").then((module) => ({
    default: module.FormTextarea,
  })),
);
const FormErrorAlert = lazy(() =>
  import("@/components/form.tsx").then((module) => ({
    default: module.FormErrorAlert,
  })),
);
const FormFieldError = lazy(() =>
  import("@/components/form.tsx").then((module) => ({
    default: module.FormFieldError,
  })),
);
const PasswordInput = lazy(() => import("@/components/password-input"));
const SubscribeButton = lazy(() =>
  import("@/components/form.tsx").then((module) => ({
    default: module.FormButton,
  })),
);

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormInput,
    FormTextarea,
    PasswordInput,
    FormFieldError,
  },
  formComponents: {
    SubscribeButton,
    FormErrorAlert,
  },
});
