"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { MasterItem } from "@prisma/client";
import { ColumnMetaProps } from "@/types";
import { DataTableDropdown } from "@/components/tables/_components/data-table-dropdown";
import { EditMasterItemForm } from "@/components/stock/edit-master-item-form";
import { deleteMasterItem } from "@/actions";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<MasterItem> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.baseUnit} ${row.original.category} ${row.original.group} ${row.original.subgroup}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableMasterItems: ColumnDef<MasterItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "ID",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Nome",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "baseUnit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unidade Base" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Unidade Base",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Categoria",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupo" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Grupo",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "subgroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subgrupo" />
    ),
    cell: ({ row }) => {
      const subgroup = row.getValue("subgroup");
      if (subgroup === null || subgroup === undefined) {
        return "-";
      } else {
        return subgroup;
      }
    },
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Subgrupo",
    } as ColumnMetaProps,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableDropdown
          entity="Item Mestre"
          rowItemId={row.original.id as number}
          formComponent={EditMasterItemForm}
          deleteAction={deleteMasterItem}
        />
      );
    },
  },
];
