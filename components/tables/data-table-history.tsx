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
import { ActionType, DataExpandableType, DataTableProps, EntityType } from "@/types";
import { BaseDataTableExpandable } from "@/components/tables/base-data-table-expandable";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

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
      label: formatEnumValueDisplay(ActionType.CREATE, "capitalize"),
    },
    {
      value: ActionType.UPDATE,
      label: formatEnumValueDisplay(ActionType.UPDATE, "capitalize"),
    },
    {
      value: ActionType.DELETE,
      label: formatEnumValueDisplay(ActionType.DELETE, "capitalize"),
    },
  ];
  const entities = [
    {
      value: EntityType.ADJUSTMENT_POSITIVE,
      label: formatEnumValueDisplay(EntityType.ADJUSTMENT_POSITIVE, "capitalize"),
    },
    {
      value: EntityType.ADJUSTMENT_NEGATIVE,
      label: formatEnumValueDisplay(EntityType.ADJUSTMENT_NEGATIVE, "capitalize"),
    },
    {
      value: EntityType.CATEGORY,
      label: formatEnumValueDisplay(EntityType.CATEGORY, "capitalize"),
    },
    {
      value: EntityType.GROUP,
      label: formatEnumValueDisplay(EntityType.GROUP, "capitalize"),
    },
    {
      value: EntityType.INPUT,
      label: formatEnumValueDisplay(EntityType.INPUT, "capitalize"),
    },
    {
      value: EntityType.MASTER_PRODUCT,
      label: formatEnumValueDisplay(EntityType.MASTER_PRODUCT, "capitalize"),
    },
    {
      value: EntityType.OUTPUT,
      label: formatEnumValueDisplay(EntityType.OUTPUT, "capitalize"),
    },
    {
      value: EntityType.PRODUCT,
      label: formatEnumValueDisplay(EntityType.PRODUCT, "capitalize"),
    },
    {
      value: EntityType.RECEIVER,
      label: formatEnumValueDisplay(EntityType.RECEIVER, "capitalize"),
    },
    {
      value: EntityType.SUBGROUP,
      label: formatEnumValueDisplay(EntityType.SUBGROUP, "capitalize"),
    },
    {
      value: EntityType.SUPPLIER,
      label: formatEnumValueDisplay(EntityType.SUPPLIER, "capitalize"),
    },
    {
      value: EntityType.USER,
      label: formatEnumValueDisplay(EntityType.USER, "capitalize"),
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
          dataExpandableType={DataExpandableType.AUDIT_LOG}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
