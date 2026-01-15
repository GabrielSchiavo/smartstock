import { ErrorCard } from "@/components/auth/error-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erro",
};

const AuthErrorPage = () => {
    return (
        <ErrorCard />
    );
};

export default AuthErrorPage;