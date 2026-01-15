import { getSuppliersCount, getProductsCount } from "@/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProductCountType } from "@/types";
import { daysDefaultUntilExpiry } from "@/utils/check-expiry-status";
import {
  BoxesIcon,
  CalendarClockIcon,
  CalendarX2Icon,
  TruckIcon,
} from "lucide-react";

export async function SectionCardsDashboard() {
  const productsCount = (await getProductsCount()).count;
  const productsToExpireCount = (
    await getProductsCount(ProductCountType.ABOUT_TO_EXPIRE)
  ).count;
  const productsExpiredCount = (
    await getProductsCount(ProductCountType.EXPIRED)
  ).count;
  const suppliersCount = (await getSuppliersCount()).count;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-6 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="bg-background! rounded-xl shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos Cadastrados
          </CardTitle>
          <BoxesIcon
            absoluteStrokeWidth={true}
            size={40}
            className="text-muted-foreground"
          />
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
      <Card className="bg-background! rounded-xl shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos à vencer
          </CardTitle>
          <CalendarClockIcon
            absoluteStrokeWidth={true}
            size={40}
            className="text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {productsToExpireCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            {`Produtos à vencer em ${daysDefaultUntilExpiry} dias`}
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-background! rounded-xl shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Produtos Vencidos
          </CardTitle>
          <CalendarX2Icon
            absoluteStrokeWidth={true}
            size={40}
            className="text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <CardTitle
            className={cn(`text-4xl font-semibold tabular-nums @[250px]/card:text-3xl`)}
          >
            {productsExpiredCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">Produtos já vencidos</div>
        </CardFooter>
      </Card>
      <Card className="bg-background! rounded-xl shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Fornecedores
          </CardTitle>
          <TruckIcon
            absoluteStrokeWidth={true}
            size={40}
            className="text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {suppliersCount}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-md  text-muted-foreground">
          <div className="line-clamp-1 flex gap-2">
            Total de fornecedores cadastrados
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
