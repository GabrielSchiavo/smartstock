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
      <Card className="px-16 py-10 shadow-md">
        <div className="grid gap-6 text-center">
          <div className="flex flex-row items-center gap-4">
            <Image
              className="size-16"
              src={LogoSmartstock}
              alt="Logo SmartStock"
            />
            <span className="text-5xl fontAlbertSans font-extralight">
              <span className="font-semibold">Smart</span>stock
            </span>
          </div>
          <p className="text-lg font-light">O melhor serviço de gestão de estoque</p>
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
