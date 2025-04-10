import { useState } from "react";
import { FormInput, FormInputProps } from "./form";
import { cn } from "@/lib/utils";
import IconShowPassword from "@/assets/icon-show-password.svg?react";
import IconHidePassword from "@/assets/icon-hide-password.svg?react";
import styles from "./password-input.module.css";

function PasswordInput({ className, ...props }: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles["password-input"]}>
      <FormInput
        type={showPassword ? "text" : "password"}
        className={cn(styles["password-input__input"], className)}
        {...props}
      />
      <button
        className={styles["password-input__toggle"]}
        onClick={toggleShowPassword}
        aria-label={showPassword ? "Hide Password" : "Show Password"}
        type="button"
      >
        {showPassword ? <IconHidePassword /> : <IconShowPassword />}
      </button>
    </div>
  );
}

export default PasswordInput;
