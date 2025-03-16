import type Mailgen from "mailgen";

export function emailVerificationTemplate(
  username: string,
  emailVerificationCode: string,
): Mailgen.Content {
  return {
    body: {
      name: username,
      intro:
        "Enter this temporary verification code to continue and fully access your account:",
      action: {
        button: {
          color: "#201F24",
          text: emailVerificationCode,
          link: "#",
        },
        instructions: "",
      },
      outro: [
        "Please note that this code will expire shortly",
        "If you didn’t create an account with us, you can safely ignore this email.",
      ],
    },
  };
}
