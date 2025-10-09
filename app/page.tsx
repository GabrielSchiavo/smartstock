import { HomeLoginButton } from "@/components/auth/home-login-button";
import { Metadata } from "next";
import { LogoWithText } from "@/components/shared/logo-with-text";
import { ROUTES } from "@/config/routes";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { InfiniteFeaturesScrolling } from "@/components/shared/infinite-features-scrolling";

export const metadata: Metadata = {
  title: "SmartStock: Gestão de Estoque",
  description: "SmartStock, o melhor sistema de gestão de estoque.",
  alternates: {
    canonical: `${ROUTES.HOME}`,
  },
};

export default function Home() {
  return (
    <main className="min-h-[100dvh]! bg-background flex justify-center items-center p-6 md:p-10 ">
      <div className="absolute top-0 left-0 p-6 md:p-10">
        <LogoWithText
          imageSize="size-8 md:size-10"
          textSize="text-1xl md:text-2xl"
        />
      </div>
      <div className="container relative flex flex-col justify-center items-center gap-20 py-20">
        <BlurFade
          className="absolute w-[100vw] h-[80vh] md:w-[600px] md:h-[600px] left-1/2 transform -translate-x-1/2 overflow-hidden"
          inView={false}
        >
          <div className="absolute w-[100vw] h-[80vh] md:w-[600px] md:h-[600px] left-1/2 transform -translate-x-1/2 overflow-hidden">
            <DotPattern
              glow={true}
              className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
              )}
            />
          </div>
        </BlurFade>

        <div className="flex w-full max-w-5xl flex-col justify-center items-center gap-10 z-20">
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="bg-muted-foreground/5 text-foreground text-xs font-medium group flex items-center justify-center gap-3 rounded-lg p-1 tracking-tight">
              <div className="bg-muted-foreground/10 flex items-center gap-3 rounded-md px-4 py-1.5">
                <span className="inline-block size-2 rounded-full! bg-primary saturate-150"></span>
                <span>Novos Recursos</span>
              </div>
              {/* <div className="flex items-center gap-2 pr-2">
                Conheça os novos recursos{" "}
                <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div> */}
            </div>

            <div className="flex flex-col w-full max-w-xl text-center gap-5">
              <h1 className="text-5xl md:text-6xl tracking-tighter font-normal">
                O melhor sistema de gestão de estoque
              </h1>
              <p className="text-lg text-muted-foreground">
                Acesse sua conta para gerenciar seu estoque de forma inteligente
                e eficiente.
              </p>
            </div>
          </div>
          <HomeLoginButton>
            <Button variant="default" size="lg" className="w-auto group">
              Acessar Conta
              <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </HomeLoginButton>
        </div>

        <div className="w-full max-w-6xl">
          <InfiniteFeaturesScrolling />
        </div>
      </div>
    </main>
  );
}
