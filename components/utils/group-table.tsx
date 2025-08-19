import React from "react";
import { Row, Table } from "@tanstack/react-table"; // Ajuste os imports conforme sua versão do TanStack Table
import { calculateTotals, createTotalSummary } from "@/lib/calculate-totals";
import { CalculableTotalItemProps } from "@/types";

export function getGroupedData<TData>(
  table: Table<TData>,
  groupBy?: string
): Record<string, Row<TData>[]> | null {
  const rowModel = table.getRowModel();

  if (!groupBy) return null;

  return rowModel.rows.reduce((acc: Record<string, Row<TData>[]>, row) => {
    const groupValue = row.original[groupBy as keyof TData];
    const groupKey = String(groupValue);

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(row);
    return acc;
  }, {});
}

export function getTotalValuesDisplayForData<TData extends CalculableTotalItemProps>(data: TData[]) {
  const totalValues = calculateTotals(data);
  const displayTotals = createTotalSummary(totalValues);

  return (
    <span className="flex items-center gap-2">
      {displayTotals}
    </span>
  );
}
