"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { AuditLog } from "@prisma/client";
import { EntityType, ActionType, ColumnMetaProps } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { formatDateTimeToLocale } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<AuditLog> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.createdAt} ${row.original.actionType} ${row.original.entity}`;

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
      header: () => null,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={row.getToggleExpandedHandler()}
              className="size-8! shrink-0"
            >
              <span className="sr-only">Expandir/Recolher Linha</span>
              {row.getIsExpanded() ? (
                <ChevronDownIcon className="size-4 shrink-0" />
              ) : (
                <ChevronRightIcon className="size-4 shrink-0" />
              )}
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
      accessorKey: "actionType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ação" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("actionType");

        switch (value) {
          case ActionType.CREATE:
            return (
              <Badge className="text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
                {formatEnumValueDisplay(ActionType.CREATE, "uppercase")}
              </Badge>
            );
          case ActionType.UPDATE:
            return (
              <Badge className="text-sm bg-yellow-500/15 text-yellow-600 dark:text-yellow-500">
                {formatEnumValueDisplay(ActionType.UPDATE, "uppercase")}
              </Badge>
            );
          case ActionType.DELETE:
            return (
              <Badge className="text-sm bg-red-500/15 text-red-600 dark:text-red-500">
                {formatEnumValueDisplay(ActionType.DELETE, "uppercase")}
              </Badge>
            );
          case ActionType.LOGIN:
            return (
              <Badge className="text-sm bg-sky-500/15 text-sky-600 dark:text-sky-500">
                {formatEnumValueDisplay(ActionType.LOGIN, "uppercase")}
              </Badge>
            );
          case ActionType.LOGOUT:
            return (
              <Badge className="text-sm bg-teal-500/15 text-teal-600 dark:text-teal-500">
                {formatEnumValueDisplay(ActionType.LOGOUT, "uppercase")}
              </Badge>
            );
          case ActionType.LOGIN_FAILURE:
            return (
              <Badge className="text-sm bg-indigo-500/15 text-indigo-600 dark:text-indigo-500">
                {formatEnumValueDisplay(ActionType.LOGIN_FAILURE, "uppercase")}
              </Badge>
            );
          default:
            return (
              <Badge className="text-sm bg-zinc-500/15 text-zinc-600 dark:text-zinc-500">
                {formatEnumValueDisplay(value as string, "uppercase")}
              </Badge>
            );
        }
      },
      meta: {
        title: "Ação",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "entity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entidade" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("entity");

        return (
          <Badge
            variant={"outline"}
            className={`text-sm ${value === EntityType.ADJUSTMENT_POSITIVE || value === EntityType.INPUT ? "text-emerald-600 dark:text-emerald-500" : value === EntityType.ADJUSTMENT_NEGATIVE || value === EntityType.OUTPUT ? "text-red-600 dark:text-red-500" : ""}`}
          >
            {formatEnumValueDisplay(value as string, "uppercase")}
          </Badge>
        );
      },
      meta: {
        title: "Entidade",
      } as ColumnMetaProps,
    },
  ];
};
