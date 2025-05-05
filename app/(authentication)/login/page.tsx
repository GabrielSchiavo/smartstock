import { LoginForm } from "@/components/login-form"
import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";
import Image from "next/image"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SmartStock",
  description: "Entre em sua conta SmartStock",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-3 self-center font-medium">
          <div className="flex size-9 items-center justify-center rounded-md bg-white text-primary-foreground">
            <Image className="size-7" src={ LogoSmartstock } alt="Logo SmartStock"/>
          </div>
          <span className="text-base font-normal"><span className="font-bold">Smart</span>Stock</span>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
