import { ErrorCard } from "@/components/auth/error-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erro - SmartStock",
};

const AuthErrorPage = () => {
    return (
        <ErrorCard />
    );
};

export default AuthErrorPage;