"use client"

import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { Product } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreVertical } from "lucide-react"
import DeleteProductDialog from "@/components/product-components/delete-product-dialog"
import { EditProductDialog } from "@/components/product-components/edit-product-dialog"

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Product> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.quantity} ${row.original.unit} ${row.original.lot} ${row.original.validityDate} ${row.original.receiptDate} ${row.original.receiver} ${row.original.donor} ${row.original.productType}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<Product>[] = [
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
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantidade
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unidade
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "lot",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lote
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "validityDate",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data de Validade
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("validityDate"))
      return date.toLocaleDateString()
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data de Recebimento
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("receiptDate"))
      return date.toLocaleDateString()
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "receiver",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Recebedor
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "group",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Grupo
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "subgroup",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Subgrupo
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "productType",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tipo de Produto
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "donor",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Doador
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <EditProductDialog product={{ id: row.original.id }} />
              <DropdownMenuSeparator />
                <DeleteProductDialog product={{ id: row.original.id }} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
]