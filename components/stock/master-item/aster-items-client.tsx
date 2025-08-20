"use client";

import { DataTableMasterItems } from "@/components/tables/data-table-master-item";
import { columnsTableMasterItems } from "@/components/tables/_columns/columns-master-item";
import { MasterProduct } from "@prisma/client";

interface MasterItemsClientProps {
  masterItems: MasterProduct[];
}

export function MasterItemsClient({ masterItems }: MasterItemsClientProps) {
  const columns = columnsTableMasterItems({});

  return (
    <DataTableMasterItems
      addButton={true}
      data={masterItems}
      columns={columns}
      groupBy="category"
    />
  );
}