import { HomeLoginButton } from '@/components/auth/home-login-button';
import { Metadata } from 'next';
import { LogoWithText } from '@/components/shared/logo-with-text';
import { ROUTES } from '@/config/routes';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { InfiniteFeaturesScrolling } from '@/components/shared/infinite-features-scrolling';

export const metadata: Metadata = {
  title: 'SmartStock: Gestão de Estoque',
  description: 'SmartStock, o melhor sistema de gestão de estoque.',
  alternates: {
    canonical: `${ROUTES.HOME}`,
  },
};

export default function Home() {
  return (
    <main className="bg-background flex min-h-[100dvh]! items-center justify-center p-6 md:p-10">
      <div className="absolute top-0 left-0 p-6 md:p-10">
        <LogoWithText imageSize="size-8 md:size-10" textSize="text-1xl md:text-2xl" />
      </div>
      <div className="relative container flex flex-col items-center justify-center gap-20 py-20">
        <BlurFade
          className="absolute left-1/2 h-[80vh] w-[100vw] -translate-x-1/2 transform overflow-hidden md:h-[600px] md:w-[600px]"
          inView={false}
        >
          <div className="absolute left-1/2 h-[80vh] w-[100vw] -translate-x-1/2 transform overflow-hidden md:h-[600px] md:w-[600px]">
            <DotPattern
              glow={true}
              className={cn(
                '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
              )}
            />
          </div>
        </BlurFade>

        <div className="z-20 flex w-full max-w-5xl flex-col items-center justify-center gap-10">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="bg-muted-foreground/5 text-foreground group flex items-center justify-center gap-3 rounded-lg p-1 text-xs font-medium tracking-tight">
              <div className="bg-muted-foreground/10 flex items-center gap-3 rounded-md px-4 py-1.5">
                <span className="bg-primary inline-block size-2 rounded-full! saturate-150"></span>
                <span>Novos Recursos</span>
              </div>
              {/* <div className="flex items-center gap-2 pr-2">
                Conheça os novos recursos{" "}
                <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div> */}
            </div>

            <div className="flex w-full max-w-xl flex-col gap-5 text-center">
              <h1 className="text-5xl font-normal tracking-tighter md:text-6xl">
                O melhor sistema de gestão de estoque
              </h1>
              <p className="text-muted-foreground text-lg">
                Acesse sua conta para gerenciar seu estoque de forma inteligente e eficiente.
              </p>
            </div>
          </div>
          <HomeLoginButton>
            <Button variant="default" size="lg" className="group w-auto">
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
