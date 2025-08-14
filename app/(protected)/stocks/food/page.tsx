import { DataTableProducts } from "@/components/tables/data-table-products";
import { columnsTableProducts } from "@/components/tables/_columns/columns-products";
import { Metadata } from "next";
import { UserType } from "@/types";
import { getProducts } from "@/actions";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Estoque de Alimentos - SmartStock",
  description: "Visualize, cadastre e gerencie produtos.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCKS_FOOD}`,
  },
};

export default async function StockFoodPage() {
  const products = await getProducts();

  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <DataTableProducts
              addButton={true}
              data={products}
              columns={columnsTableProducts}
              groupBy="group"
            />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
