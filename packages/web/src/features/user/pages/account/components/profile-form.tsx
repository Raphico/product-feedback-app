import { Form, FormItem, FormLabel } from "@/components/form";
import { useAppForm } from "@/lib/form";
import styles from "./profile-form.module.css";
import { userSchema } from "../../../validation";
import { showErrorToast } from "@/utils/error";
import { Button } from "@/components/button";
import { User } from "@/features/user/types";
import { useUpdateMeMutation } from "@/features/user/service";
import { toast } from "sonner";

interface ProfileFormProps {
  userData: Pick<User, "email" | "username" | "fullName">;
}

function ProfileForm({ userData }: ProfileFormProps) {
  const [updateMe] = useUpdateMeMutation();

  const form = useAppForm({
    defaultValues: {
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
    },
    validators: {
      onSubmit: userSchema,
    },
    async onSubmit({ value }) {
      try {
        await updateMe({
          fullName: value.fullName,
          username: value.username,
        }).unwrap();
        toast.success("Profile Updated Successfully");
        form.reset(value, { keepDefaultValues: true });
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  return (
    <>
      <form.AppForm>
        <form.FormErrorAlert />
      </form.AppForm>
      <Form
        className={styles["profile-form"]}
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FormItem className={styles["profile-form__item"]}>
          <FormLabel htmlFor="email">Full Name</FormLabel>
          <form.AppField
            name="fullName"
            children={(field) => (
              <>
                <field.FormInput
                  disabled={form.state.isSubmitting}
                  id="fullName"
                  name="fullName"
                />
                <field.FormFieldError />
              </>
            )}
          />
        </FormItem>

        <FormItem className={styles["profile-form__item"]}>
          <FormLabel htmlFor="email">Username</FormLabel>
          <form.AppField
            name="username"
            children={(field) => (
              <>
                <field.FormInput
                  disabled={form.state.isSubmitting}
                  id="username"
                  name="username"
                />
                <field.FormFieldError />
              </>
            )}
          />
        </FormItem>

        <FormItem className={styles["profile-form__item"]}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <form.AppField
            name="email"
            children={(field) => (
              <>
                <field.FormInput
                  disabled
                  id="email"
                  type="email"
                  name="email"
                />
                <field.FormFieldError />
              </>
            )}
          />
        </FormItem>

        <form.Subscribe
          selector={(state) => state.isDirty}
          children={(isDirty) =>
            isDirty && (
              <div className={styles["profile-form__buttons"]}>
                <form.Subscribe
                  selector={(state) => state.isSubmitting}
                  children={(isSubmitting) => (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => form.reset()}
                      variants="tertiary"
                    >
                      Cancel
                    </Button>
                  )}
                />

                <form.AppForm>
                  <form.SubscribeButton size="default">
                    Update
                  </form.SubscribeButton>
                </form.AppForm>
              </div>
            )
          }
        />
      </Form>
    </>
  );
}

export default ProfileForm;
