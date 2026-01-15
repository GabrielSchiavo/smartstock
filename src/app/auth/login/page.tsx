import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/config/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SmartStock",
  description: "Acesse sua conta SmartStock.",
  alternates: {
    canonical: `${ROUTES.AUTH_LOGIN}`,
  },
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
