"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  ColumnDef,
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
import { DataTableProps, TableType } from "@/types";
import { BaseDataTable } from "./base-data-table";

export function DataTableUsers<TData, TValue>({
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

  // Extract row model to a separate variable for the dependency array
  const rowModel = table.getRowModel();

  const groupedData = React.useMemo(() => {
    if (!groupBy) return null;

    return rowModel.rows.reduce((acc: Record<string, Row<TData>[]>, row) => {
      const groupValue = row.original[groupBy];
      const groupKey = String(groupValue);

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(row);
      return acc;
    }, {});
  }, [rowModel.rows, groupBy]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const toggleAllGroups = () => {
    if (!groupedData) return;

    if (collapsedGroups.size === Object.keys(groupedData).length) {
      // All groups are collapsed, so expand all
      setCollapsedGroups(new Set());
    } else {
      // Collapse all groups
      setCollapsedGroups(new Set(Object.keys(groupedData)));
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-2 items-center justify-between">
        <DataTableToolbar
          toolTip={false}
          addButton={addButton}
          addButtonType={TableType.USER}
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
          showGroupTotal={false}
          showFooter={false}
        />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
