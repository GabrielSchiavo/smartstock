"use client";

import { DataTableViewOptions } from "@/components/tables/_components/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/tables/_components/data-table-faceted-filter";
import { DataTableToolTipHelp } from "@/components/tables/_components/data-table-tool-tip-help";
import { AddUserDialog } from "@/components/user/add-user-dialog";
import { AddProductDialog } from "@/components/product/add-product-dialog";
import { DataTableToolbarProps } from "@/types";



export function DataTableToolbar<TData>({
  table,
  toolTip,
  addButton,
  addButtonType,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-4 sm:gap-6 w-full">
      <div className="flex items-center gap-2">
        <DataTableFacetedFilter table={table} />
        { toolTip ? <DataTableToolTipHelp /> : null }
      </div>
      <DataTableViewOptions table={table} />
      { addButton === true && addButtonType === "USER" ? <AddUserDialog /> : null }
      { addButton === true && addButtonType === "PRODUCT" ? <AddProductDialog /> : null }
      { addButton === false ? null : null }
    </div>
  );
}
