"use client";

import { DataTableHistory } from "@/components/tables/data-table-history";
import { columnsTableHistory } from "@/components/tables/_columns/columns-table-history";
import { ClientHistoryProps } from "@/types";

export function ClientHistory({ history }: ClientHistoryProps) {
  return (
    <DataTableHistory
      columns={columnsTableHistory({})}
      data={history}
      addButton={false}
    />
  );
}
