import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { LogoWithText } from "@/components/shared/logo-with-text";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "SmartStock: Gestão de Estoque",
  description: "SmartStock, o melhor sistema de gestão de estoque.",
  alternates: {
    canonical: `${ROUTES.HOME}`,
  },
};

export default function Home() {
  return (
    <main className="h-full flex items-center justify-center p-6 bg-radial from-sky-400 via-blue-500 to-blue-800">
      <Card className="w-full max-w-md shadow-lg p-8 sm:p-8 md:p-10 justify-center">
        <div className="grid gap-6 text-center">
          <LogoWithText
            imageSize="size-12 md:size-14"
            textSize="text-3xl md:text-4xl"
          />
          <p className="text-base md:text-lg font-light">
            O melhor sistema de gestão de estoque
          </p>
          <div>
            <LoginButton>
              <Button variant="default" size="lg" className="w-auto">
                Entrar
              </Button>
            </LoginButton>
          </div>
        </div>
      </Card>
    </main>
  );
}
