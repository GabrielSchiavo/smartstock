import { ResetForm } from "@/components/auth/reset-form";
import { ROUTES } from "@/config/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir senha - SmartStock",
  description: "Redefina sua senha de acesso.",
  alternates: {
    canonical: `${ROUTES.AUTH_RESET_PASSWORD}`,
  },
};

const ResetPage = () => {
  return <ResetForm />;
};

export default ResetPage;
