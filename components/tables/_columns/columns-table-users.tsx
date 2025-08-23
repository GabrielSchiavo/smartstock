"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { User } from "@prisma/client";
import { ColumnMetaProps, UserType } from "@/types";
import { DataTableDropdown } from "@/components/tables/_components/data-table-dropdown";
import { FormEditUser } from "@/components/user/form-edit-user";
import { deleteUser } from "@/actions";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<User> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.email} ${row.original.emailVerified} ${row.original.role}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableUsers: ColumnDef<User>[] = [
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
    meta: {
      title: "Nome",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: {
      title: "Email",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Verificado" />
    ),
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified");
      if (verified === null) {
        return (
          <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
            Não
          </span>
        );
      } else {
        return (
          <span className="bg-emerald-500/15 px-3 py-1 rounded-sm text-sm text-emerald-600 dark:text-emerald-500">
            Sim
          </span>
        );
      }
    },
    meta: {
      title: "Email Verificado",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nível de Acesso" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      if (role === UserType.DEFAULT) {
        return <span className="uppercase">Padrão</span>;
      } else if (role === UserType.CADASTRE) {
        return <span className="uppercase">Cadastro</span>;
      } else if (role === UserType.REPORT) {
        return <span className="uppercase">Relatório</span>;
      } else {
        return (
          <span className="bg-muted px-3 py-1 rounded-sm uppercase">
            {role}
          </span>
        );
      }
    },
    meta: {
      title: "Nível de Acesso",
    } as ColumnMetaProps,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableDropdown
          entity="Usuário"
          rowItemId={row.original.id as string}
          formComponent={FormEditUser}
          deleteAction={deleteUser}
        />
      );
    },
  },
];
