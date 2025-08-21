"use client";

import { DataTableViewOptions } from "@/components/tables/_components/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/tables/_components/data-table-faceted-filter";
import { DataTableToolTipHelp } from "@/components/tables/_components/data-table-tool-tip-help";
import { DataTableToolbarProps, ModeType, TableType } from "@/types";
import { AddEditDialog } from "@/components/shared/add-edit-dialog";
import { FormAddProduct } from "@/components/stock/product/form-add-product";
import { FormAddUser } from "@/components/user/form-add-user";
import { FormAddMasterProduct } from "@/components/stock/master-product/form-add-master-product";

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
