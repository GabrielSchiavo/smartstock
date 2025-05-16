import { getDonorsCount } from "@/actions/donor";
import {
  getExpiredProductsCount,
  getProductsCount,
  getProductsToExpireCount,
} from "@/actions/product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Boxes, CalendarClock, CalendarX2, HandHeart } from "lucide-react";

export function SectionCards() {
  const productsCount = getProductsCount();
  const productsToExpireCount = getProductsToExpireCount();
  const expiredProductsCount = getExpiredProductsCount();
  const donorsCount = getDonorsCount();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card  grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="bg-transparent!">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos Cadastrados
          </CardTitle>
          <Boxes strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {productsCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            Total de produtos cadastrados
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent!">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos à vencer
          </CardTitle>
          <CalendarClock strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {productsToExpireCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            Produtos à vencer em 30 dias
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent!">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos Vencidos
          </CardTitle>
          <CalendarX2 strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {expiredProductsCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            Produtos que já vencidos
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent!">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">Doadores</CardTitle>
          <HandHeart strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {donorsCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            Total de doadores cadastrados
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
