"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { User } from "@prisma/client";
import { ColumnMetaProps, UserType } from "@/types";
import { DataTableDropdown } from "@/components/tables/_components/data-table-dropdown";
import { FormEditUser } from "@/components/user/form-edit-user";
import { deleteUser } from "@/actions";
import { Badge } from "@/components/ui/badge";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<User> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.email} ${row.original.emailVerified} ${row.original.role}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export function columnsTableUsers(currentUserId?: string): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      id: "badgeYou",
      header: () => null,
      cell: ({ row }) => {
        const id = row.getValue("id");
        if (id === currentUserId) {
          return (
            <span className="flex items-center justify-center gap-3">
              <Badge variant={"outline"} className="text-sm">
                Você
              </Badge>
            </span>
          );
        }
        return null;
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
            <Badge className="text-sm bg-red-500/15 text-red-600 dark:text-red-500">
              Não
            </Badge>
          );
        } else {
          return (
            <Badge className="text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
              Sim
            </Badge>
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
          return (
            <Badge variant={"outline"} className="text-sm uppercase">
              Padrão
            </Badge>
          );
        } else if (role === UserType.CADASTRE) {
          return (
            <Badge variant={"outline"} className="text-sm uppercase">
              Cadastro
            </Badge>
          );
        } else if (role === UserType.REPORT) {
          return (
            <Badge variant={"outline"} className="text-sm uppercase">
              Relatório
            </Badge>
          );
        } else {
          return <Badge className="text-sm bg-muted">{role}</Badge>;
        }
      },
      meta: {
        title: "Nível de Acesso",
      } as ColumnMetaProps,
    },
    {
      id: "actions",
      header: () => null,
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
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
