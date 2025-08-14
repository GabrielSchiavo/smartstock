import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="grid gap-3 max-w-lg mx-auto text-center">
          <h3 className="text-lg text-primary font-semibold">Erro 404</h3>
          <p className="text-4xl font-semibold sm:text-5xl fontAlbertSans">
            Página não encontrada
          </p>
          <p className="text-md text-muted-foreground">
            Desculpe, a página que você está procurando não foi encontrada ou
            foi removida.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.HOME}>
              <Button variant={"default"} size={"default"}>
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
