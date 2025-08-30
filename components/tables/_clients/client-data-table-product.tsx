"use client";

import { columnsTableProducts } from "@/components/tables/_columns/columns-table-products";
import { DataTableProducts } from "@/components/tables/data-table-products";
import { ClientDataTableProductProps } from "@/types";

export function ClientDataTableProduct({ products, addButton, groupBy }: ClientDataTableProductProps) {
  return (
    <DataTableProducts
      addButton={addButton}
      data={products}
      columns={columnsTableProducts({})}
      groupBy={groupBy}
    />
  );
}
