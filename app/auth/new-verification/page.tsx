import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar email - SmartStock",
  description: "Verifique seu email",
};

const NewVerificationPage = () => {
    return (
        <NewVerificationForm />
    );
};

export default NewVerificationPage;