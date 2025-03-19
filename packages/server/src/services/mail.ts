import Mailgen from "mailgen";
import nodemailer, { type Transporter } from "nodemailer";
import type { Config } from "../config.js";
import type { Logger } from "pino";
import { emailVerificationTemplate } from "../templates/email-verification.js";
import { passwordResetTemplate } from "../templates/password-reset.js";

export class MailService {
  private mailGenerator: Mailgen;
  private transporter: Transporter;

  constructor(
    private config: Config,
    private logger: Logger,
  ) {
    this.mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: config.productName,
        link: config.clientUrl,
      },
    });

    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  generateEmail(content: Mailgen.Content) {
    return {
      html: this.mailGenerator.generate(content),
      text: this.mailGenerator.generatePlaintext(content),
    };
  }

  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: this.config.senderEmailAddress,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
      // So it's better to fail silently rather than breaking the app
      this.logger.error(error, "Failed to send email");
    }
  }

  async sendEmailVerificationCode({
    username,
    emailVerificationCode,
    to,
  }: {
    username: string;
    to: string;
    emailVerificationCode: string;
  }) {
    try {
      const { html, text } = this.generateEmail(
        emailVerificationTemplate(username, emailVerificationCode),
      );
      await this.sendMail({ to, subject: "Email Verification", text, html });
    } catch (error) {
      this.logger.error("Email service failed silently", error);
    }
  }

  async sendPasswordResetLink({
    username,
    passwordResetUrl,
    to,
  }: {
    username: string;
    passwordResetUrl: string;
    to: string;
  }) {
    try {
      const { html, text } = this.generateEmail(
        passwordResetTemplate(username, passwordResetUrl),
      );
      await this.sendMail({ to, subject: "Reset Password", text, html });
    } catch (error) {
      this.logger.error("Email service failed silently", error);
    }
  }
}
