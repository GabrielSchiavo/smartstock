import { Metadata } from "next";
import { UserType } from "@/types";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { DataTableMasterItems } from "@/components/tables/data-table-master-item";
import { columnsTableMasterItems } from "@/components/tables/_columns/columns-master-item";
import { getMasterItems } from "@/actions/master-item.action";

export const metadata: Metadata = {
  title: "Item Mestre - SmartStock",
  description: "Visualize, cadastre e gerencie os Items Mestre do estoque.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCK_MASTER_ITEM}`,
  },
};

export default async function StockFoodPage() {
  const masterItems = await getMasterItems();
  const columns = columnsTableMasterItems({});

  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <DataTableMasterItems
              addButton={true}
              data={masterItems}
              columns={columns}
              groupBy="category"
            />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
