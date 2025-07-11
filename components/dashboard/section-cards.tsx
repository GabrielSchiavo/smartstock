import { getDonorsCount, getExpiredProductsCount } from "@/actions";
import {
  getProductsCount,
  getProductsToExpireCount,
} from "@/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoxesIcon, CalendarClockIcon, CalendarX2Icon, HandHeartIcon } from "lucide-react";

export async function SectionCards() {
  const productsResponse = await getProductsCount();
  const productsToExpireResponse = await getProductsToExpireCount();
  const productsExpiredResponse = await getExpiredProductsCount();
  const donorsResponse = await getDonorsCount();

  const productsCount = productsResponse.count;
  const productsToExpireCount = productsToExpireResponse.count;
  const productsExpiredCount = productsExpiredResponse.count;
  const donorsCount = donorsResponse.count;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="bg-transparent!">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos Cadastrados
          </CardTitle>
          <BoxesIcon strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
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
          <CalendarClockIcon strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
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
          <CalendarX2Icon strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {productsExpiredCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            Produtos já vencidos
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent!">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">Doadores</CardTitle>
          <HandHeartIcon strokeWidth={1.5} className="h-10 w-10 text-muted-foreground" />
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
