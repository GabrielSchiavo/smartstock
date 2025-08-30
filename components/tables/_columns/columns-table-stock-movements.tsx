"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { StockMovement } from "@prisma/client";
import {
  ColumnMetaProps,
  MovementType,
  InputMovementCategoryType,
  OutputMovementCategoryType,
  AdjustmentMovementCategoryType,
} from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { formatDateTimeToLocale } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<StockMovement> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.createdAt} ${row.original.movementType} ${row.original.movementCategory}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableStockMovements = ({}): ColumnDef<StockMovement>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "expand",
      header: () => null,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={row.getToggleExpandedHandler()}
              className="size-8! shrink-0"
            >
              <span className="sr-only">Expandir Linha</span>
              {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data/Hora" />
      ),
      cell: ({ row }) => {
        const validityDate = new Date(row.getValue("createdAt"));
        const dateString = formatDateTimeToLocale(validityDate);

        return dateString;
      },
      meta: {
        title: "Data/Hora",
      } as ColumnMetaProps,
      filterFn: multiColumnFilterFn,
    },
    {
      accessorKey: "movementType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Movimentação" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("movementType");

        switch (value) {
          case MovementType.INPUT:
            return (
              <Badge
                variant={"outline"}
                className="text-sm text-emerald-600 dark:text-emerald-500"
              >
                ENTRADA
              </Badge>
            );
          case MovementType.OUTPUT:
            return (
              <Badge
                variant={"outline"}
                className="text-sm text-red-600 dark:text-red-500"
              >
                SAÍDA
              </Badge>
            );
          case MovementType.ADJUSTMENT_POSITIVE:
            return (
              <Badge
                variant={"outline"}
                className="text-sm text-emerald-600 dark:text-emerald-500"
              >
                AJUSTE POSITIVO
              </Badge>
            );
          case MovementType.ADJUSTMENT_NEGATIVE:
            return (
              <Badge
                variant={"outline"}
                className="text-sm text-red-600 dark:text-red-500"
              >
                AJUSTE NEGATIVO
              </Badge>
            );
          default:
            return (
              <Badge className="text-sm bg-zinc-500/15 text-zinc-600 dark:text-zinc-500">
                {value as string}
              </Badge>
            );
        }
      },
      meta: {
        title: "Movimentação",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "movementCategory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("movementCategory");

        switch (value) {
          case InputMovementCategoryType.DONATION ||
            OutputMovementCategoryType.DONATION:
            return (
              <Badge variant={"outline"} className="text-sm">
                DOAÇÃO
              </Badge>
            );
          case InputMovementCategoryType.PURCHASE:
            return (
              <Badge variant={"outline"} className="text-sm">
                COMPRA
              </Badge>
            );
          case InputMovementCategoryType.RETURN ||
            OutputMovementCategoryType.RETURN:
            return (
              <Badge variant={"outline"} className="text-sm">
                RETORNO
              </Badge>
            );
          case InputMovementCategoryType.TRANSFER ||
            OutputMovementCategoryType.TRANSFER:
            return (
              <Badge variant={"outline"} className="text-sm">
                TRANSFERÊNCIA
              </Badge>
            );
          case OutputMovementCategoryType.CONSUMPTION:
            return (
              <Badge variant={"outline"} className="text-sm">
                CONSUMO
              </Badge>
            );
          case OutputMovementCategoryType.SALE:
            return (
              <Badge variant={"outline"} className="text-sm">
                VENDA
              </Badge>
            );
          case AdjustmentMovementCategoryType.CORRECTION:
            return (
              <Badge variant={"outline"} className="text-sm">
                CORREÇÃO
              </Badge>
            );
          case AdjustmentMovementCategoryType.DUE_DATE:
            return (
              <Badge variant={"outline"} className="text-sm">
                VENCIMENTO
              </Badge>
            );
          case AdjustmentMovementCategoryType.GENERAL:
            return (
              <Badge variant={"outline"} className="text-sm">
                GERAL
              </Badge>
            );
          case AdjustmentMovementCategoryType.LOSS_DAMAGE:
            return (
              <Badge variant={"outline"} className="text-sm">
                PERDA/AVARIA
              </Badge>
            );
          case AdjustmentMovementCategoryType.THEFT_MISPLACEMENT:
            return (
              <Badge variant={"outline"} className="text-sm">
                FURTO/EXTRAVIO
              </Badge>
            );
          default:
            return (
              <Badge variant={"outline"} className="text-sm">
                {value as string}
              </Badge>
            );
        }
      },
      meta: {
        title: "Categoria",
      } as ColumnMetaProps,
    },
  ];
};
