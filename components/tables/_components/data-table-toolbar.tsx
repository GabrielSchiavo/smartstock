"use client";

import { DataTableViewOptions } from "@/components/tables/_components/data-table-view-options";

import { DataTableSearchBox } from "@/components/tables/_components/data-table-search-box";
import { DataTableToolTipHelp } from "@/components/tables/_components/data-table-tool-tip-help";
import { DataTableToolbarProps, ModeType, TableType } from "@/types";
import { AddEditDialog } from "@/components/shared/add-edit-dialog";
import { FormAddProduct } from "@/components/stock/product/form-add-product";
import { FormAddUser } from "@/components/user/form-add-user";
import { FormAddMasterProduct } from "@/components/stock/master-product/form-add-master-product";
import { DataTableFacetedFilter } from "@/components/tables/_components/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function DataTableToolbar<TData>({
  table,
  toolTip,
  addButton,
  addButtonType,
  searchColumnKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  // checa se alguma coluna está filtrada (TanStack Table typical state)
  const isFiltered =
    (table?.getState()?.columnFilters?.length ?? 0) > 0 ||
    (table?.getState()?.globalFilter ? true : false);

  return (
    <div className="flex items-center justify-between gap-4 sm:gap-6 w-full">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <DataTableSearchBox table={table} searchColumnKey={searchColumnKey} />

        {filters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => {
              const column = table.getColumn?.(f.columnKey);
              if (!column) return null;

              return (
                <DataTableFacetedFilter
                  key={f.columnKey}
                  column={column}
                  title={f.title ?? f.columnKey}
                  options={f.options ?? []}
                />
              );
            })}
            {isFiltered && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                aria-label="Redefinir filtros"
              >
                <XIcon className="ml-1" />
                Redefinir
              </Button>
            )}
          </div>
        )}

        {toolTip ? <DataTableToolTipHelp /> : null}
      </div>
      <DataTableViewOptions table={table} />
      {addButton === true && addButtonType === TableType.USER ? (
        <AddEditDialog
          entity="Usuário"
          mode={ModeType.ADD}
          formComponent={FormAddUser}
        />
      ) : null}
      {addButton === true && addButtonType === TableType.PRODUCT ? (
        <AddEditDialog
          entity="Produto"
          mode={ModeType.ADD}
          formComponent={FormAddProduct}
        />
      ) : null}
      {addButton === true && addButtonType === TableType.MASTER_ITEM ? (
        <AddEditDialog
          entity="Produto Mestre"
          mode={ModeType.ADD}
          formComponent={FormAddMasterProduct}
        />
      ) : null}
      {addButton === false ? null : null}
    </div>
  );
}
