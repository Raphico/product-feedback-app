import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { User } from "@/features/user/types";
import styles from "./avatar-uploader.module.css";
import { useAppForm } from "@/lib/form";
import {
  type UpdateAvatarSchema,
  updateAvatarSchema,
} from "../../../validation";
import { useUpdateAvatarMutation } from "@/features/user/service";
import { showErrorToast } from "@/utils/error";
import { toast } from "sonner";

interface AvatarUploaderProps {
  userData: Pick<User, "fullName" | "avatar">;
}

function AvatarUploader({ userData }: AvatarUploaderProps) {
  const [updateAvatar] = useUpdateAvatarMutation();

  const form = useAppForm({
    defaultValues: {
      avatar: userData.avatar as string | File | null,
    },
    validators: {
      onChange: updateAvatarSchema,
    },
    async onSubmit({ value }) {
      try {
        await updateAvatar(value as UpdateAvatarSchema).unwrap();
        toast.success("Avatar Updated Successfully");
        form.reset(value, { keepDefaultValues: true });
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  const initials = userData.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  function getPreviewUrl(avatar: string | File) {
    if (typeof avatar == "string") return avatar;
    return URL.createObjectURL(avatar);
  }

  return (
    <form
      className={styles["avatar-uploader__form"]}
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="avatar"
        children={(field) => (
          <>
            <input
              type="file"
              id="avatar"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                field.handleChange(file);
              }}
              aria-describedby="avatar-instructions"
            />
            <label
              htmlFor="avatar"
              role="button"
              aria-label="Change Profile Image"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  document.getElementById("avatar")?.click();
                }
              }}
              className={styles["avatar-uploader__label"]}
            >
              <Avatar>
                <AvatarImage
                  className={styles["avatar-uploader__avatar"]}
                  src={
                    field.state.value ? getPreviewUrl(field.state.value) : null
                  }
                  alt={`${userData.fullName} profile image`}
                />
                <AvatarFallback className={styles["avatar-uploader__avatar"]}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </label>
            <p id="avatar-instructions" className="sr-only">
              Upload an image less than 5MB. Supported formats: JPEG, PNG, WEBP,
              GIF, SVG.
            </p>
            <field.FormFieldError />

            {field.state.value && (
              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={(isSubmitting) => (
                  <button
                    className={styles["avatar-uploader__remove-avatar-btn"]}
                    type="button"
                    disabled={isSubmitting}
                    aria-label="Remove uploaded avatar"
                    onClick={() => field.handleChange(null)}
                  >
                    x
                  </button>
                )}
              />
            )}
          </>
        )}
      />

      <form.Subscribe
        selector={(state) => state.isDirty}
        children={(isDirty) =>
          isDirty && (
            <form.AppForm>
              <form.SubscribeButton
                size="default"
                variants="tertiary"
                className={styles["avatar-uploader__upload-button"]}
              >
                Update
              </form.SubscribeButton>
            </form.AppForm>
          )
        }
      />
    </form>
  );
}

export default AvatarUploader;
