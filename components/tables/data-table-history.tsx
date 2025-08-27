"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableToolbar } from "@/components/tables/_components/data-table-toolbar";
import { DataTablePagination } from "@/components/tables/_components/data-table-pagination";
import { ActionType, DataTableProps, EntityType } from "@/types";
import { BaseDataTableExpandable } from "@/components/tables/base-data-table-expandable";

export function DataTableHistory<TData, TValue>({
  columns,
  data,
  addButton,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const actions = [
    {
      value: ActionType.CREATE,
      label: "Criado",
    },
    {
      value: ActionType.UPDATE,
      label: "Atualizado",
    },
    {
      value: ActionType.DELETE,
      label: "Excluído",
    },
  ];
  const entities = [
    {
      value: EntityType.ADJUSTMENT,
      label: "Ajuste",
    },
    {
      value: EntityType.CATEGORY,
      label: "Categoria",
    },
    {
      value: EntityType.GROUP,
      label: "Grupo",
    },
    {
      value: EntityType.INPUT,
      label: "Entrada",
    },
    {
      value: EntityType.MASTER_PRODUCT,
      label: "Produto Mestre",
    },
    {
      value: EntityType.OUTPUT,
      label: "Saída",
    },
    {
      value: EntityType.PRODUCT,
      label: "Produto",
    },
    {
      value: EntityType.RECEIVER,
      label: "Recebedor",
    },
    {
      value: EntityType.SUBGROUP,
      label: "Subgrupo",
    },
    {
      value: EntityType.SUPPLIER,
      label: "Fornecedor",
    },
    {
      value: EntityType.USER,
      label: "Usuário",
    },
  ];
  const filters = [
  { columnKey: "actionType", title: "Ação", options: actions },
  { columnKey: "entity", title: "Entidade", options: entities },
];

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-2 items-center justify-between">
        <DataTableToolbar
          toolTip={false}
          addButton={addButton}
          table={table}
          searchColumnKey="createdAt"
            filters={filters}
        />
      </div>

      <div className="rounded-xl border overflow-hidden">
        <BaseDataTableExpandable
          table={table}
          columns={columns as ColumnDef<TData>[]}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
