// utils/tableGroupUtils.ts
import React from "react";
import { UnitType, LocaleType, GroupedTableTotalValuesProps } from "@/types"; // Ajuste o caminho conforme necessário
import { Row, Table } from "@tanstack/react-table"; // Ajuste os imports conforme sua versão do TanStack Table

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
      const unit = original.unit;
      const unitWeight = original.unitWeight || 0;
      const unitOfUnitWeight = original.unitOfUnitWeight || UnitType.KG;

      let itemWeight = 0;
      let itemVolume = 0;

      if (unit === UnitType.KG) {
        itemWeight = quantity;
      } else if (unit === UnitType.G) {
        itemWeight = quantity / 1000;
      } else if (unit === UnitType.L) {
        itemVolume = quantity;
      } else if (unit === UnitType.UN) {
        if (unitOfUnitWeight === UnitType.G) {
          itemWeight = quantity * (unitWeight / 1000);
        } else if (unitOfUnitWeight === UnitType.L) {
          itemVolume = quantity * unitWeight;
        } else {
          itemWeight = quantity * unitWeight;
        }
      }

      return {
        weight: total.weight + itemWeight,
        volume: total.volume + itemVolume,
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
