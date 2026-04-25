'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

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
          <div className="mx-auto flex h-screen max-w-screen-xl items-center justify-start px-4 md:px-8">
            <div className="mx-auto grid max-w-lg gap-3 text-center">
              <h3 className="text-primary text-lg font-semibold">Erro Inesperado</h3>
              <p className="font-albert-sans text-4xl font-semibold sm:text-5xl">
                Algo deu errado!
              </p>
              <p className="text-md text-muted-foreground">
                Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => reset()} variant={'default'} size={'default'}>
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
