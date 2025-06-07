import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { LogoWithText } from "@/components/shared/logo-with-text";

export const metadata: Metadata = {
  title: "SmartStock",
  description: "SmartStock",
};

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-radial from-sky-400 to-blue-800">
      <Card className="p-7 sm:px-16 sm:py-10 shadow-md">
        <div className="grid gap-6 text-center">
          <LogoWithText imageSize="size-16" textSize="text-5xl" />
          <p className="text-lg font-light">
            O melhor serviço de gestão de estoque
          </p>
          <div>
            <LoginButton>
              <Button variant={"default"} size={"lg"}>
                Entrar
              </Button>
            </LoginButton>
          </div>
        </div>
      </Card>
    </main>
  );
}
