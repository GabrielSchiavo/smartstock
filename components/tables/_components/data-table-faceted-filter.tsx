import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTableFunctionsProps } from "@/types";

export function DataTableFacetedFilter<TData>({
  table,
}: DataTableFunctionsProps<TData>) {
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
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
    </div>
  );
}
