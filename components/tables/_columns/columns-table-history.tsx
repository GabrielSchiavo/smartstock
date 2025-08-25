"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { AuditLog } from "@prisma/client";
import { ColumnMetaProps } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { formatDateTimeToLocale } from "@/lib/date-utils";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<AuditLog> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.createdAt} ${row.original.actionType} ${row.original.actionCategory}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableHistory = ({}): ColumnDef<AuditLog>[] => {
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
      header: "",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={row.getToggleExpandedHandler()}
            className="h-8 w-8 p-0"
          >
            {row.getIsExpanded() ? (
              <ChevronDownIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data e Hora" />
      ),
      cell: ({ row }) => {
        const validityDate = new Date(row.getValue("createdAt"));
        const dateString = formatDateTimeToLocale(validityDate);

        return dateString;
      },
      meta: {
        title: "Data e Hora",
      } as ColumnMetaProps,
      filterFn: multiColumnFilterFn,
    },
    {
      accessorKey: "actionType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de Ação" />
      ),
      meta: {
        title: "Tipo de Ação",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "actionCategory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria de Ação" />
      ),
      meta: {
        title: "Categoria de Ação",
      } as ColumnMetaProps,
    },
  ];
};
