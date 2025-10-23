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
import {
  ActionType,
  DataExpandableType,
  DataTableProps,
  EntityType,
  FiltersGroupType,
} from "@/types";
import { BaseDataTableExpandable } from "@/components/tables/base-data-table-expandable";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

export function DataTableHistory<TData, TValue>({
  columns,
  data,
  addButton,
  filterGroup,
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

  const actionsDefault = [
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
  const actionsSystem = [
    {
      value: ActionType.LOGIN,
      label: formatEnumValueDisplay(ActionType.LOGIN, "capitalize"),
    },
    {
      value: ActionType.LOGOUT,
      label: formatEnumValueDisplay(ActionType.LOGOUT, "capitalize"),
    },
    {
      value: ActionType.LOGIN_FAILURE,
      label: formatEnumValueDisplay(ActionType.LOGIN_FAILURE, "capitalize"),
    },
  ];
  const entitiesInputsOutputs = [
    {
      value: EntityType.INPUT,
      label: formatEnumValueDisplay(EntityType.INPUT, "capitalize"),
    },
    {
      value: EntityType.OUTPUT,
      label: formatEnumValueDisplay(EntityType.OUTPUT, "capitalize"),
    },
  ];
  const entitiesAdjustments = [
    {
      value: EntityType.ADJUSTMENT_POSITIVE,
      label: formatEnumValueDisplay(
        EntityType.ADJUSTMENT_POSITIVE,
        "capitalize"
      ),
    },
    {
      value: EntityType.ADJUSTMENT_NEGATIVE,
      label: formatEnumValueDisplay(
        EntityType.ADJUSTMENT_NEGATIVE,
        "capitalize"
      ),
    },
  ];
  const entitiesSystem = [
    {
      value: EntityType.SYSTEM,
      label: formatEnumValueDisplay(EntityType.SYSTEM, "capitalize"),
    },
  ];
  const entitiesMiscellaneous = [
    {
      value: EntityType.CATEGORY,
      label: formatEnumValueDisplay(EntityType.CATEGORY, "capitalize"),
    },
    {
      value: EntityType.GROUP,
      label: formatEnumValueDisplay(EntityType.GROUP, "capitalize"),
    },
    {
      value: EntityType.MASTER_PRODUCT,
      label: formatEnumValueDisplay(EntityType.MASTER_PRODUCT, "capitalize"),
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

  const getEntitiesOptions = () => {
    switch (filterGroup) {
      case FiltersGroupType.INPUTS_OUTPUTS_HISTORY:
        return entitiesInputsOutputs;

      case FiltersGroupType.ADJUSTMENTS_HISTORY:
        return entitiesAdjustments;

      case FiltersGroupType.SYSTEM_HISTORY:
        return entitiesSystem;

      default:
        return entitiesMiscellaneous;
    }
  };

  const filters = [
    {
      columnKey: "actionType",
      title: "Ação",
      options:
        filterGroup === FiltersGroupType.SYSTEM_HISTORY
          ? actionsSystem
          : actionsDefault,
    },
    {
      columnKey: "entity",
      title: "Entidade",
      options: getEntitiesOptions(),
    },
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
