"use client";

import { ClientDataTableUserProps } from "@/types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { columnsTableUsers } from "@/components/tables/_columns/columns-table-users";
import { DataTableUsers } from "@/components/tables/data-table-users";

export function ClientDataTableUser({ users }: ClientDataTableUserProps) {
  const currentUserId = useCurrentUser()?.id;

  const columns = columnsTableUsers(currentUserId);

  return <DataTableUsers addButton={true} data={users} columns={columns} />;
}
