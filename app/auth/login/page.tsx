import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SmartStock",
  description: "Acesse sua conta SmartStock",
};

const LoginPage = () => {
    return (
        <LoginForm />
    )
}

export default LoginPage;