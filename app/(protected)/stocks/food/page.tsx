import { DataTableProducts } from "@/components/tables/data-table-products";
import { columnsTableProducts } from "@/components/tables/_columns/columns-products";
import { Metadata } from "next";
import { UserType } from "@/types";
import { getProducts } from "@/actions";
import { RoleGate } from "@/components/auth/role-gate";

export const metadata: Metadata = {
  title: "Estoque de Produtos - SmartStock",
  description: "Vizualize e cadastre produtos alimentícios",
};

export default async function StockFoodPage() {
  const products = await getProducts();

  return (
    <RoleGate isPage={true} allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
            <h1 className="text-base font-medium px-4 lg:px-6">
              Estoque de Produtos
            </h1>
            <div className="px-4 md:px-6 ">
              <DataTableProducts
                addButton={true}
                data={products}
                columns={columnsTableProducts}
                groupBy="group"
              />
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
