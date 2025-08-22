import { Metadata } from "next";
import { UserType } from "@/types";
import { getProducts } from "@/actions";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { ClientProduct } from "@/components/stock/product/client-product";

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
          <div className="flex flex-col gap-4 md:gap-6">
            <ClientProduct products={products} addButton={false} groupBy="masterProduct.group" />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
