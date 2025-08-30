"use client";

import { DataTableMasterProducts } from "@/components/tables/data-table-master-products";
import { columnsTableMasterProducts } from "@/components/tables/_columns/columns-table-master-products";
import { ClientDataTableMasterProductProps } from "@/types";

export function ClientDataTableMasterProduct({ masterProducts }: ClientDataTableMasterProductProps) {
  return (
    <DataTableMasterProducts
      addButton={true}
      data={masterProducts}
      columns={columnsTableMasterProducts({})}
      groupBy="category"
    />
  );
}