"use client";

import { ClientDataTableStockMovementProps } from "@/types";
import { DataTableStockMovements } from "../data-table-stock-movements";
import { columnsTableStockMovements } from "../_columns/columns-table-stock-movements";

export function ClientDataTableStockMovements({ movements }: ClientDataTableStockMovementProps) {
  return (
    <DataTableStockMovements
      columns={columnsTableStockMovements({})}
      data={movements}
      addButton={false}
    />
  );
}
