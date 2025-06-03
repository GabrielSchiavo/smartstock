// hooks/useGroupedTable.ts
import { getGroupedData } from "@/components/utils/group-table";
import { GroupedTableProps } from "@/types";
import { useMemo } from "react";

export function useGroupedTable<TData>({
  table,
  groupBy,
  collapsedGroups,
  setCollapsedGroups,
}: GroupedTableProps<TData>) {
  const getTableState = table.getState();

  const groupedData = useMemo(
    () => getGroupedData(table, groupBy as string),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, groupBy, getTableState]
  );

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const toggleAllGroups = () => {
    if (!groupedData) return;

    if (collapsedGroups.size === Object.keys(groupedData).length) {
      // Todos estão recolhidos, expandir todos
      setCollapsedGroups(new Set());
    } else {
      // Recolher todos os grupos
      setCollapsedGroups(new Set(Object.keys(groupedData)));
    }
  };

  return {
    groupedData,
    toggleGroup,
    toggleAllGroups,
  };
}