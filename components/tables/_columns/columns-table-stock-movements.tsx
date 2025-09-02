"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { StockMovement } from "@prisma/client";
import { ColumnMetaProps, MovementType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { formatDateTimeToLocale } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

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

        return (
          <Badge
            variant={"outline"}
            className={`text-sm ${value === MovementType.ADJUSTMENT_POSITIVE || value === MovementType.INPUT ? "text-emerald-600 dark:text-emerald-500" : value === MovementType.ADJUSTMENT_NEGATIVE || value === MovementType.OUTPUT ? "text-red-600 dark:text-red-500" : ""}`}
          >
            {formatEnumValueDisplay(value as string, "uppercase")}
          </Badge>
        );
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

        return (
          <Badge variant={"outline"} className="text-sm">
            {formatEnumValueDisplay(value as string, "uppercase")}
          </Badge>
        );
      },
      meta: {
        title: "Categoria",
      } as ColumnMetaProps,
    },
  ];
};
