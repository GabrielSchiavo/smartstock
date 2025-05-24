"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/_components/data-table-column-header";
import { Product, ProductType } from "@prisma/client";
import { DataTableDropdownProduct } from "../_components/data-table-dropdown-product";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Product> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.quantity} ${row.original.unit} ${row.original.lot} ${row.original.validityDate} ${row.original.receiptDate} ${row.original.receiver} ${row.original.donor} ${row.original.productType}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableProducts: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
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
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unidade" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "lot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lote" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "validityDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Validade" />
    ),
    cell: ({ row }) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Remove a parte de horas para comparar apenas datas

      const validityDate = new Date(row.getValue("validityDate"));
      validityDate.setHours(0, 0, 0, 0);

      const diffTime = validityDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24); // Converter para dias

      const dateString = validityDate.toLocaleDateString();

      if (diffDays < 0) {
        // Data passada
        return (
          <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
            {dateString}
          </span>
        );
      } else if (diffDays <= 30) {
        // Dentro de 30 dias
        return (
          <span className="bg-yellow-500/15 px-3 py-1 rounded-sm text-sm text-yellow-600 dark:text-yellow-500">
            {dateString}
          </span>
        );
      } else {
        // Mais de 30 dias no futuro
        return (
          <span className="bg-emerald-500/15 px-3 py-1 rounded-sm text-sm text-emerald-600 dark:text-emerald-500">
            {dateString}
          </span>
        );
      }
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Recebimento" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("receiptDate"));
      return date.toLocaleDateString();
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "receiver",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recebedor" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupo" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "subgroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subgrupo" />
    ),
    cell: ({ row }) => {
      const subgroup = row.getValue("subgroup");
      if (subgroup === null) {
        return "N/A";
      } else {
        return subgroup;
      }
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "productType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Produto" />
    ),
    cell: ({ row }) => {
      const verified = row.getValue("productType");
      if (verified === ProductType.DONATED) {
        return (
          <span className="border-1 border-muted px-3 py-1 rounded-sm text-sm uppercase">
            Doado
          </span>
        );
      } else {
        return (
          <span className="bg-muted px-3 py-1 rounded-sm text-sm uppercase">
            Comprado
          </span>
        );
      }
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "donor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doador" />
    ),
    cell: ({ row }) => {
      const donor = row.getValue("donor");
      if (donor === null) {
        return "N/A";
      } else {
        return donor;
      }
    },
    filterFn: multiColumnFilterFn,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableDropdownProduct rowItemId={row.original.id}/>
      );
    },
  },
];
