"use client";

import { DataTableHistory } from "@/components/tables/data-table-history";
import { columnsTableHistory } from "@/components/tables/_columns/columns-table-history";
import { ClientDataTableHistoryProps } from "@/types";

export function ClientDataTableHistory({ history }: ClientDataTableHistoryProps) {
  return (
    <DataTableHistory
      columns={columnsTableHistory({})}
      data={history}
      addButton={false}
    />
  );
}
