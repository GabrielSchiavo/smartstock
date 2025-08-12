"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
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
  Maximize2Icon,
  Minimize2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableProps } from "@/types";
import { useGroupedTable } from "@/hooks/use-grouped-table";
import { getTotalValuesDisplayForData } from "@/components/utils/group-table";
import { BaseDataTable } from "./base-data-table";

export function DataTableProducts<TData, TValue>({
  columns,
  data,
  addButton,
  groupBy,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(
    new Set()
  );

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Agrupa os dados se groupBy for especificado
  const { groupedData, toggleGroup, toggleAllGroups } = useGroupedTable({
    table,
    groupBy,
    collapsedGroups,
    setCollapsedGroups,
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-2 items-center justify-between">
        <DataTableToolbar
          toolTip={true}
          addButton={addButton}
          addButtonType={"PRODUCT"}
          table={table}
        />
        {groupBy && groupedData && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAllGroups}
                  className="ml-auto"
                >
                  {collapsedGroups.size === Object.keys(groupedData).length ? (
                    <Maximize2Icon />
                  ) : (
                    <Minimize2Icon />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {collapsedGroups.size === Object.keys(groupedData).length
                    ? "Expandir Grupos"
                    : "Recolher Grupos"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <BaseDataTable
          table={table}
          columns={columns as ColumnDef<TData>[]}
          groupedData={groupedData as Record<string, Row<TData>[]>}
          collapsedGroups={collapsedGroups}
          toggleGroup={toggleGroup}
          showGroupTotal={true}
          showFooter={true}
          footerContent={
            <div className="flex items-center justify-start gap-2">
              TOTAL FINAL:
              <span>{getTotalValuesDisplayForData(data)}</span>
            </div>
          }
        />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
