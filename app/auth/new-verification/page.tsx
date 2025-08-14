import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { ROUTES } from "@/config/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar email - SmartStock",
  description: "Verifique seu endereço de email.",
  alternates: {
    canonical: `${ROUTES.AUTH_NEW_VERIFICATION}`,
  },
};

const NewVerificationPage = () => {
  return <NewVerificationForm />;
};

export default NewVerificationPage;
