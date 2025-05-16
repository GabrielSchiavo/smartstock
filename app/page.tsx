import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartStock",
  description: "SmartStock",
};

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-radial from-sky-400 to-blue-800">
      <Card className="p-10 shadow-md">
        <div className="space-y-6 text-center">
          <div className="flex flex-row items-center gap-6">
            <Image
              className="size-16"
              src={LogoSmartstock}
              alt="Logo SmartStock"
            />
            <h1 className={"text-5xl font-semibold"}>
              SmartStock
            </h1>
          </div>
          <p className="text-lg">A best stock management service</p>
          <div>
            <LoginButton>
              <Button variant={"default"} size={"lg"}>
                Sign in
              </Button>
            </LoginButton>
          </div>
        </div>
      </Card>
    </main>
  );
}
