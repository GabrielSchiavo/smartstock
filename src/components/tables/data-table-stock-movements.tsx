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
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

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
      label: formatEnumValueDisplay(MovementType.INPUT, "capitalize"),
    },
    {
      value: MovementType.OUTPUT,
      label: formatEnumValueDisplay(MovementType.OUTPUT, "capitalize"),
    },
    {
      value: MovementType.ADJUSTMENT_POSITIVE,
      label: formatEnumValueDisplay(MovementType.ADJUSTMENT_POSITIVE, "capitalize"),
    },
    {
      value: MovementType.ADJUSTMENT_NEGATIVE,
      label: formatEnumValueDisplay(MovementType.ADJUSTMENT_NEGATIVE, "capitalize"),
    },
  ];
  const categories = [
    {
      value: InputMovementCategoryType.DONATION || OutputMovementCategoryType.DONATION,
      label: formatEnumValueDisplay(InputMovementCategoryType.DONATION, "capitalize"),
    },
    {
      value: InputMovementCategoryType.PURCHASE,
      label: formatEnumValueDisplay(InputMovementCategoryType.PURCHASE, "capitalize"),
    },
    {
      value: InputMovementCategoryType.TRANSFER || OutputMovementCategoryType.TRANSFER,
      label: formatEnumValueDisplay(InputMovementCategoryType.TRANSFER, "capitalize"),
    },
    {
      value: InputMovementCategoryType.RETURN || OutputMovementCategoryType.RETURN,
      label: formatEnumValueDisplay(InputMovementCategoryType.RETURN, "capitalize"),
    },
    {
      value: OutputMovementCategoryType.CONSUMPTION,
      label: formatEnumValueDisplay(OutputMovementCategoryType.CONSUMPTION, "capitalize"),
    },
    {
      value: OutputMovementCategoryType.SALE,
      label: formatEnumValueDisplay(OutputMovementCategoryType.SALE, "capitalize"),
    },
    {
      value: AdjustmentMovementCategoryType.CORRECTION,
      label: formatEnumValueDisplay(AdjustmentMovementCategoryType.CORRECTION, "capitalize"),
    },
    {
      value: AdjustmentMovementCategoryType.DUE_DATE,
      label: formatEnumValueDisplay(AdjustmentMovementCategoryType.DUE_DATE, "capitalize"),
    },
    {
      value: AdjustmentMovementCategoryType.GENERAL,
      label: formatEnumValueDisplay(AdjustmentMovementCategoryType.GENERAL, "capitalize"),
    },
    {
      value: AdjustmentMovementCategoryType.LOSS_DAMAGE,
      label: formatEnumValueDisplay(AdjustmentMovementCategoryType.LOSS_DAMAGE, "capitalize"),
    },
    {
      value: AdjustmentMovementCategoryType.THEFT_MISPLACEMENT,
      label: formatEnumValueDisplay(AdjustmentMovementCategoryType.THEFT_MISPLACEMENT, "capitalize"),
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
