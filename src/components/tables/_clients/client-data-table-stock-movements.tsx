"use client";

import { ClientDataTableStockMovementProps } from "@/types";
import { DataTableStockMovements } from "@/components/tables/data-table-stock-movements";
import { columnsTableStockMovements } from "@/components/tables/_columns/columns-table-stock-movements";

export function ClientDataTableStockMovements({ movements }: ClientDataTableStockMovementProps) {
  return (
    <DataTableStockMovements
      columns={columnsTableStockMovements({})}
      data={movements}
      addButton={false}
    />
  );
}
