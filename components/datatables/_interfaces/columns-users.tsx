"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import DeleteUserDialog from "@/components/user-components/delete-user-dialog";
import { EditUserDialog } from "@/components/user-components/edit-user-dialog";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<User> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.email} ${row.original.emailVerified} ${row.original.role}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email Verificado
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified");
      if (verified === null) {
        return <span className="bg-red-500/15 px-3 py-1 rounded text-sm text-red-500">Não</span>;
      } else {
        return <span className="bg-emerald-500/15 px-3 py-1 rounded text-sm text-emerald-500">Sim</span>
      }
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nível de Acesso
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
              <EditUserDialog user={{ id: row.original.id }} />
            <DropdownMenuSeparator />
            <DeleteUserDialog user={{ id: row.original.id }} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
