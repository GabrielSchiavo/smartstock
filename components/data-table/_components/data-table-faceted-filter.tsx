import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DataTableFacetedFilterProps<TData> {
  table: Table<TData>;
}

export function DataTableFacetedFilter<TData>({
  table,
}: DataTableFacetedFilterProps<TData>) {
  return (
    <div className="relative">
      <Input
        placeholder="Pesquisar na tabela...."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm default-height pl-8"
      />
      <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
    </div>
  );
}
