import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registre-se - SmartStock",
  description: "Crie sua conta SmartStock",
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
