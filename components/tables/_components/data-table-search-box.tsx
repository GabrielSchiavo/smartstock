import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTableFunctionsProps } from "@/types";

interface DataTableFacetedFilterProps<TData> extends DataTableFunctionsProps<TData> {
  searchColumnKey?: string; // Permite especificar qual coluna usar para busca
}

export function DataTableSearchBox<TData>({
  table,
  searchColumnKey = "id", // Usa "id" como padrão, mas pode ser qualquer coluna que tenha multiColumnFilterFn
}: DataTableFacetedFilterProps<TData>) {
  return (
    <div className="relative">
      <Input
        placeholder="Pesquisar na tabela...."
        value={(table.getColumn(searchColumnKey)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchColumnKey)?.setFilterValue(event.target.value)
        }
        className="max-w-sm default-height pl-8"
      />
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
    </div>
  );
}