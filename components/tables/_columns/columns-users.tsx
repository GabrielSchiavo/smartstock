"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { User } from "@prisma/client";
import { UserType } from "@/types";
import { DataTableDropdownUser } from "../_components/data-table-dropdown-user";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<User> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.email} ${row.original.emailVerified} ${row.original.role}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableUsers: ColumnDef<User>[] = [
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
    accessorKey: "email",
        header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "emailVerified",
        header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email verificado" />
    ),
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified");
      if (verified === null) {
        return <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">Não</span>;
      } else {
        return <span className="bg-emerald-500/15 px-3 py-1 rounded-sm text-sm text-emerald-600 dark:text-emerald-500">Sim</span>
      }
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "role",
        header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nível de acesso" />
    ),
      cell: ({ row }) => {
      const role = row.getValue("role") as string;
      if (role === UserType.DEFAULT) {
        return <span className="uppercase">Padrão</span>;
      } else if (role === UserType.CADASTRE) {
        return <span className="uppercase">Cadastro</span>
      } else if(role === UserType.REPORT) {
        return <span className="uppercase">Relatório</span>
      } else {
        return <span className="bg-muted px-3 py-1 rounded-sm uppercase">{ role }</span> 
      }
    },
    filterFn: multiColumnFilterFn,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableDropdownUser rowItemId={row.original.id}/>
      );
    },
  },
];
