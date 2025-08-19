import React from "react";
import { UnitType, LocaleType, GroupedTableTotalValuesProps } from "@/types"; // Ajuste o caminho conforme necessário
import { Row, Table } from "@tanstack/react-table"; // Ajuste os imports conforme sua versão do TanStack Table
import { normalizeQuantity } from "@/lib/unit-conversion";

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

export function getTotalValuesDisplayForData<TData>(data: TData[]) {
  const totalValues = data.reduce(
    (total: GroupedTableTotalValuesProps, item) => {
      const original = item as unknown as {
        quantity?: number;
        unit?: UnitType;
        unitWeight?: number;
        unitOfUnitWeight?: UnitType;
      };

      const quantity = original.quantity || 0;
      const unit = original.unit as UnitType;
      const unitWeight = original.unitWeight || 0;
      const unitOfUnitWeight = original.unitOfUnitWeight as UnitType;

      // 1. Normaliza o valor do item
      const normalizedValue = normalizeQuantity(
        quantity,
        unit,
        unitWeight,
        unitOfUnitWeight
      );
      
      // 2. Atualiza os totais
      return {
        weight: total.weight + normalizedValue.weight,
        volume: total.volume + normalizedValue.volume,
      };
    },
    { weight: 0, volume: 0 }
  );

  const hasUnit = (unitTypes: UnitType[], data: TData[]) =>
    data.some((item) => {
      const product = item as unknown as {
        unit?: UnitType;
        unitOfUnitWeight?: UnitType;
      };
      return (
        unitTypes.includes(product.unit!) ||
        (product.unit === UnitType.UN &&
          unitTypes.includes(product.unitOfUnitWeight!))
      );
    });

  const format = (value: number, unit: string) =>
    Number(value.toFixed(3)).toLocaleString(LocaleType.PT_BR, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }) + ` ${unit}`;

  const hasLiters = hasUnit([UnitType.L], data);
  const hasKilos =
    hasUnit([UnitType.KG, UnitType.G], data) ||
    (hasUnit([UnitType.UN], data) && !hasUnit([UnitType.L], data));

  return hasKilos && hasLiters ? (
    <span className="flex items-center gap-2">
      <span>{format(totalValues.weight, UnitType.KG)}</span>
      <span>{" & "}</span>
      <span>{format(totalValues.volume, UnitType.L)}</span>
    </span>
  ) : hasLiters ? (
    format(totalValues.volume, UnitType.L)
  ) : (
    format(totalValues.weight, UnitType.KG)
  );
}
