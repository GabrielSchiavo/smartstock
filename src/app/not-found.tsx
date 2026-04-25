import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <div className="mx-auto flex h-screen max-w-screen-xl items-center justify-start px-4 md:px-8">
        <div className="mx-auto grid max-w-lg gap-3 text-center">
          <h3 className="text-primary text-lg font-semibold">Erro 404</h3>
          <p className="font-albert-sans text-4xl font-semibold sm:text-5xl">
            Página não encontrada
          </p>
          <p className="text-md text-muted-foreground">
            Desculpe, a página que você está procurando não foi encontrada ou foi removida.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.HOME}>
              <Button variant={'default'} size={'default'}>
                Voltar para Home
              </Button>
            </Link>
            {/* <Link href="#">
              <Button variant={"outline"} size={"default"}>
                Contatar suporte
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </main>
  );
}
