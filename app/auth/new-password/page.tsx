import { NewPasswordForm } from "@/components/auth/new-password-form";
import { ROUTES } from "@/config/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualizar senha - SmartStock",
  description: "Mude sua senha de acesso",
  alternates: {
    canonical: `${ROUTES.AUTH_NEW_PASSWORD}`,
  },
};

const NewPasswordPage = () => {
    return (
        <NewPasswordForm />
    );
};

export default NewPasswordPage;