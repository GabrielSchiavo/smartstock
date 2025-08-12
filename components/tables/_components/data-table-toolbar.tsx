"use client";

import { DataTableViewOptions } from "@/components/tables/_components/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/tables/_components/data-table-faceted-filter";
import { DataTableToolTipHelp } from "@/components/tables/_components/data-table-tool-tip-help";
import { DataTableToolbarProps, ModeType } from "@/types";
import { AddEditDialog } from "@/components/shared/add-edit-dialog";
import { AddProductForm } from "@/components/product/add-product-form";
import { AddUserForm } from "@/components/user/add-user-form";

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
        {toolTip ? <DataTableToolTipHelp /> : null}
      </div>
      <DataTableViewOptions table={table} />
      {addButton === true && addButtonType === "USER" ? (
        <AddEditDialog
          entity="Usuário"
          mode={ModeType.ADD}
          formComponent={AddUserForm}
        />
      ) : null}
      {addButton === true && addButtonType === "PRODUCT" ? (
        <AddEditDialog
          entity="Alimento"
          mode={ModeType.ADD}
          formComponent={AddProductForm}
        />
      ) : null}
      {addButton === false ? null : null}
    </div>
  );
}
