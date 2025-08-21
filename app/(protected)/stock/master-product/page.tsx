import { Metadata } from "next";
import { UserType } from "@/types";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { getMasterProducts } from "@/actions/master-item.action";
import { ClientMasterProducts } from "@/components/stock/master-product/client-master-product";

export const metadata: Metadata = {
  title: "Produto Mestre - SmartStock",
  description: "Visualize, cadastre e gerencie os Items Mestre do estoque.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCK_MASTER_PRODUCT}`,
  },
};

export default async function MasterProductPage() {
  const masterProducts = await getMasterProducts();
  
  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <ClientMasterProducts masterProducts={masterProducts} />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
