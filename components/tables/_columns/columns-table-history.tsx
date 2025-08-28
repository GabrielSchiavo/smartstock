"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { AuditLog } from "@prisma/client";
import { EntityType, ActionType, ColumnMetaProps } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { formatDateTimeToLocale } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";

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
      header: "",
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
                CRIADO
              </Badge>
            );
          case ActionType.UPDATE:
            return (
              <Badge className="text-sm bg-yellow-500/15 text-yellow-600 dark:text-yellow-500">
                ATUALIZADO
              </Badge>
            );
          case ActionType.DELETE:
            return (
              <Badge className="text-sm bg-red-500/15 text-red-600 dark:text-red-500">
                EXCLUÍDO
              </Badge>
            );
          case ActionType.LOGIN:
            return (
              <Badge className="text-sm bg-sky-500/15 text-sky-600 dark:text-sky-500">
                LOGIN
              </Badge>
            );
          case ActionType.LOGOUT:
            return (
              <Badge className="text-sm bg-teal-500/15 text-teal-600 dark:text-teal-500">
                LOGOUT
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

        switch (value) {
          case EntityType.ADJUSTMENT_POSITIVE:
            return (
              <Badge variant={"outline"} className="text-sm text-emerald-600 dark:text-emerald-500">
                AJUSTE POSITIVO
              </Badge>
            );
          case EntityType.ADJUSTMENT_NEGATIVE:
            return (
              <Badge variant={"outline"} className="text-sm text-red-600 dark:text-red-500">
                AJUSTE NEGATIVO
              </Badge>
            );
          case EntityType.CATEGORY:
            return (
              <Badge variant={"outline"} className="text-sm">
                CATEGORIA
              </Badge>
            );
          case EntityType.GROUP:
            return (
              <Badge variant={"outline"} className="text-sm">
                GRUPO
              </Badge>
            );
          case EntityType.INPUT:
            return (
              <Badge variant={"outline"} className="text-sm text-emerald-600 dark:text-emerald-500">
                ENTRADA
              </Badge>
            );
          case EntityType.MASTER_PRODUCT:
            return (
              <Badge variant={"outline"} className="text-sm">
                PRODUTO MESTRE
              </Badge>
            );
          case EntityType.OUTPUT:
            return (
              <Badge variant={"outline"} className="text-sm text-red-600 dark:text-red-500">
                SAÍDA
              </Badge>
            );
          case EntityType.PRODUCT:
            return (
              <Badge variant={"outline"} className="text-sm">
                PRODUTO
              </Badge>
            );
          case EntityType.RECEIVER:
            return (
              <Badge variant={"outline"} className="text-sm">
                RECEBEDOR
              </Badge>
            );
          case EntityType.SUBGROUP:
            return (
              <Badge variant={"outline"} className="text-sm">
                SUBGRUPO
              </Badge>
            );
          case EntityType.SUPPLIER:
            return (
              <Badge variant={"outline"} className="text-sm">
                FORNECEDOR
              </Badge>
            );
          case EntityType.USER:
            return (
              <Badge variant={"outline"} className="text-sm">
                USUÁRIO
              </Badge>
            );
          case EntityType.SYSTEM:
            return (
              <Badge variant={"outline"} className="text-sm">
                SISTEMA
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
        title: "Entidade",
      } as ColumnMetaProps,
    },
  ];
};
