import { ResetForm } from "@/components/auth/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir senha - SmartStock",
  description: "Redefina sua senha de acesso",
};

const ResetPage = () => {
    return (
        <ResetForm />
    )
}

export default ResetPage;