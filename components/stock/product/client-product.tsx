"use client";

import { columnsTableProducts } from "@/components/tables/_columns/columns-products";
import { DataTableProducts } from "@/components/tables/data-table-products";
import { ClientProductProps } from "@/types";

export function ClientProduct({ products, addButton, groupBy }: ClientProductProps) {
  return (
    <DataTableProducts
      addButton={addButton}
      data={products}
      columns={columnsTableProducts({})}
      groupBy={groupBy}
    />
  );
}
