import { Metadata } from "next";
import { UserType } from "@/types";
import { getProducts } from "@/actions";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { ClientDataTableProduct } from "@/components/tables/_clients/client-data-table-product";

export const metadata: Metadata = {
  title: "Estoque - SmartStock",
  description: "Visualize o Estoque completo.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCK}`,
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
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <h1 className="text-lg leading-none font-semibold">
                <span className="flex gap-3 items-center">
                  Visualizar Estoque
                </span>
              </h1>
              <p className="text-muted-foreground text-sm w-full md:max-w-md">
                {"Visualize e gerencie o estoque completo."}
              </p>
            </div>
            <ClientDataTableProduct
              products={products}
              addButton={false}
              groupBy="masterProduct.group.name"
            />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
