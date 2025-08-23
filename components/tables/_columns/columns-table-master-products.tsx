"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { MasterProduct } from "@prisma/client";
import { ColumnMetaProps, ColumnsTableMasterProductsProps } from "@/types";
import { DataTableDropdown } from "@/components/tables/_components/data-table-dropdown";
import { FormEditMasterProduct } from "@/components/stock/master-product/form-edit-master-product";
import { deleteMasterProduct } from "@/actions";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<MasterProduct> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.baseUnit} ${row.original.category} ${row.original.group} ${row.original.subgroup}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableMasterProducts = ({
  isSelectingAction = false,
  onSelect,
  selectedMasterProductId,
}: ColumnsTableMasterProductsProps): ColumnDef<MasterProduct>[] => [
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      );
    },
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
    meta: {
      title: "Nome",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "baseUnit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unidade Base" />
    ),
    meta: {
      title: "Unidade Base",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    meta: {
      title: "Categoria",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupo" />
    ),
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
    meta: {
      title: "Subgrupo",
    } as ColumnMetaProps,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (isSelectingAction && onSelect) {
        const isSelected =
          selectedMasterProductId === row.original.id.toString();
        return (
          <Button
            onClick={() => onSelect(row.original)}
            variant={isSelected ? "outline" : "default"}
            size="sm"
            disabled={isSelected}
          >
            {isSelected ? "Selecionado" : "Selecionar"}
          </Button>
        );
      } else {
        return (
          <DataTableDropdown
            entity="Produto Mestre"
            rowItemId={row.original.id as number}
            formComponent={FormEditMasterProduct}
            deleteAction={deleteMasterProduct}
          />
        );
      }
    },
  },
];
