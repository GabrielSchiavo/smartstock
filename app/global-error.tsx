"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main>
          <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
            <div className="grid gap-3 max-w-lg mx-auto text-center">
              <h3 className="text-lg text-primary font-semibold">
                Erro Inesperado
              </h3>
              <p className="text-4xl font-semibold sm:text-5xl fontAlbertSans">
                Algo deu errado!
              </p>
              <p className="text-md text-muted-foreground">
                Desculpe, ocorreu um erro inesperado. Por favor, tente
                novamente.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={() => reset()}
                  variant={"default"}
                  size={"default"}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
