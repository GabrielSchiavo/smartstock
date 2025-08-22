"use client";

import { DataTableMasterProducts } from "@/components/tables/data-table-master-product";
import { columnsTableMasterProducts } from "@/components/tables/_columns/columns-master-products";
import { ClientMasterProductProps } from "@/types";

export function ClientMasterProduct({ masterProducts }: ClientMasterProductProps) {
  return (
    <DataTableMasterProducts
      addButton={true}
      data={masterProducts}
      columns={columnsTableMasterProducts({})}
      groupBy="category"
    />
  );
}