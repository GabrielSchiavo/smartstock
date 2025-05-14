import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualizar senha - SmartStock",
  description: "Mude sua senha de acesso",
};

const NewPasswordPage = () => {
    return (
        <NewPasswordForm />
    );
};

export default NewPasswordPage;