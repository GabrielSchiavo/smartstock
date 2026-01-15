import React from "react";
import { Row, Table } from "@tanstack/react-table";
import { calculateTotals, createTotalSummary } from "@/utils/calculate-totals";
import { CalculableTotalItemProps } from "@/types";

// Função auxiliar para acessar propriedades aninhadas de forma type-safe
function getNestedProperty(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function getGroupedData<TData>(
  table: Table<TData>,
  groupBy?: string
): Record<string, Row<TData>[]> | null {
  const rowModel = table.getRowModel();

  if (!groupBy) return null;

  return rowModel.rows.reduce((acc: Record<string, Row<TData>[]>, row) => {
    let groupValue: unknown;
    
    if (groupBy.includes('.')) {
      // Para chaves aninhadas como "masterProduct.group.name"
      groupValue = getNestedProperty(row.original, groupBy);
    } else {
      // Para chaves simples
      groupValue = (row.original as Record<string, unknown>)[groupBy];
    }
    
    const groupKey = String(groupValue || 'Sem grupo');
    
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