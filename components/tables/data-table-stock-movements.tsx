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
import { AdjustmentMovementCategoryType, DataExpandableType, DataTableProps, InputMovementCategoryType, MovementType, OutputMovementCategoryType } from "@/types";
import { BaseDataTableExpandable } from "@/components/tables/base-data-table-expandable";

export function DataTableStockMovements<TData, TValue>({
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

  const movements = [
    {
      value: MovementType.INPUT,
      label: "Entrada",
    },
    {
      value: MovementType.OUTPUT,
      label: "Saída",
    },
    {
      value: MovementType.ADJUSTMENT_POSITIVE,
      label: "Ajuste Positivo",
    },
    {
      value: MovementType.ADJUSTMENT_NEGATIVE,
      label: "Ajuste Negativo",
    },
  ];
  const categories = [
    {
      value: InputMovementCategoryType.DONATION || OutputMovementCategoryType.DONATION,
      label: "Doação",
    },
    {
      value: InputMovementCategoryType.PURCHASE,
      label: "Compra",
    },
    {
      value: InputMovementCategoryType.TRANSFER || OutputMovementCategoryType.TRANSFER,
      label: "Transferência",
    },
    {
      value: InputMovementCategoryType.RETURN || OutputMovementCategoryType.RETURN,
      label: "Retorno",
    },
    {
      value: OutputMovementCategoryType.CONSUMPTION,
      label: "Consumo",
    },
    {
      value: OutputMovementCategoryType.SALE,
      label: "Venda",
    },
    {
      value: AdjustmentMovementCategoryType.CORRECTION,
      label: "Correção",
    },
    {
      value: AdjustmentMovementCategoryType.DUE_DATE,
      label: "Vencimento",
    },
    {
      value: AdjustmentMovementCategoryType.GENERAL,
      label: "Geral",
    },
    {
      value: AdjustmentMovementCategoryType.LOSS_DAMAGE,
      label: "Perda/Dano",
    },
    {
      value: AdjustmentMovementCategoryType.THEFT_MISPLACEMENT,
      label: "Furto/Extravio",
    },    
  ];
  const filters = [
    { columnKey: "movementType", title: "Movimentação", options: movements },
    { columnKey: "movementCategory", title: "Categoria", options: categories },
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
          dataExpandableType={DataExpandableType.STOCK_MOVEMENT}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
