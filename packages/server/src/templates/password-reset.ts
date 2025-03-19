import type Mailgen from "mailgen";

export function passwordResetTemplate(
  username: string,
  passwordResetUrl: string,
): Mailgen.Content {
  return {
    body: {
      name: username,
      intro:
        "A password change has been requested for your account. If this was you, please use the link below to reset your password.",
      action: {
        button: {
          text: "Reset your password",
          link: passwordResetUrl,
          color: "#201F24",
        },
        instructions: "",
      },
      outro: `Please note that this link will expire shortly.`,
    },
  };
}
