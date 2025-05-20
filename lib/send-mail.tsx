import { render } from "@react-email/components";
import ResetPasswordEmailTemplate from "@/components/emails/reset-password-email-template";
import { transporter } from "@/lib/mail";
import VerificationEmailTemplate from "@/components/emails/verification-email-template";

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
    from: '"Smartstock" <gabriel@sysbase.com.br>',
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
    from: '"Smartstock" <gabriel@sysbase.com.br>',
    to: email,
    priority: "high",
    subject: "Confirme sua conta",
    headers: {
      "x-priority": "1", // For Outlook and other clients
      "x-msmail-priority": "High", // For Outlook
    },
    html: emailTemplate,
  });
};
