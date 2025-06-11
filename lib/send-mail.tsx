import { render } from "@react-email/components";
import ResetPasswordEmailTemplate from "@/components/emails/reset-password-email-template";
import { transporter } from "@/lib/mail";
import VerificationEmailTemplate from "@/components/emails/verification-email-template";
import { SmtpTransporter } from "@/types";

export function getAuthenticateSmtpUser(): string {
  const t = transporter as SmtpTransporter;

  const auth = t.transporter.options.auth;
  if (!auth?.user) {
    throw new Error("Usuário SMTP não configurado no nodemailer transporter.");
  }
  return auth.user;
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const resetUrl = `http://localhost:3000/auth/new-password?token=${token}`;
  const emailTemplate = await render(
    <ResetPasswordEmailTemplate url={resetUrl} userName={name} />
  );

  await transporter.sendMail({
    from: `SmartStock <${process.env.MAIL_FROM || getAuthenticateSmtpUser()}>`,
    to: email,
    priority: "high",
    subject: "Redefinir sua senha",
    headers: {
      "x-priority": "1", // For Outlook and other clients
      "x-msmail-priority": "High", // For Outlook
    },
    html: emailTemplate,
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string,
) => {
  const confirmUrl = `http://localhost:3000/auth/new-verification?token=${token}`;
  const emailTemplate = await render(
    <VerificationEmailTemplate url={confirmUrl} userName={name} />
  );

  await transporter.sendMail({
    from: `SmartStock <${process.env.MAIL_FROM || getAuthenticateSmtpUser()}>`,
    to: email,
    priority: "high",
    subject: "Confirme sua conta",
    headers: {
      "x-priority": "1",
      "x-msmail-priority": "High",
    },
    html: emailTemplate,
  });
};
