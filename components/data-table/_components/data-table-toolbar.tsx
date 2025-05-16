"use client";

import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/data-table/_components/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/data-table/_components/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-6 w-full">
      <DataTableFacetedFilter table={table} />
      <DataTableViewOptions table={table} />
    </div>
  );
}
