import {
  FormInput,
  FormTextarea,
  FormErrorAlert,
  FormFieldError,
  FormButton as SubscribeButton,
} from "@/components/form.tsx";
import PasswordInput from "@/components/password-input";

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./context";

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
