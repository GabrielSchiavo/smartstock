"use client";

import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { getTotalValuesDisplayForData } from "@/components/utils/group-table";
import { BaseDataTableProps, CalculableTotalItemProps } from "@/types";
import { MoonLoader } from "react-spinners";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

// Type guard to check if data can be used for totals
function isCalculableTotalData(
  data: unknown[]
): data is CalculableTotalItemProps[] {
  return (
    data.length === 0 ||
    (!!data[0] && typeof data[0] === "object" && data[0] !== null)
  );
}

export function BaseDataTable<TData>({
  table,
  columns,
  groupedData,
  collapsedGroups,
  toggleGroup,
  showGroupTotal = false,
  showFooter = false,
  footerContent,
  isLoading = false,
}: BaseDataTableProps<TData>) {
  const rowModel = table.getRowModel();

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="text-center!">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-center!">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rowModel.rows?.length ? (
          groupedData ? (
            Object.entries(groupedData).map(([groupName, groupRows]) => {
              const isCollapsed = collapsedGroups.has(groupName);
              const rowOriginals = groupRows.map((row) => row.original);
              const totalToShow =
                showGroupTotal && isCalculableTotalData(rowOriginals)
                  ? getTotalValuesDisplayForData(rowOriginals)
                  : null;

              return (
                <React.Fragment key={groupName}>
                  <TableRow
                    className={`cursor-pointer ${
                      isCollapsed
                        ? "bg-transparent hover:bg-accent/45"
                        : "bg-accent/45"
                    }`}
                    onClick={() => toggleGroup(groupName)}
                    aria-expanded={!isCollapsed}
                  >
                    <TableCell
                      colSpan={columns.length}
                      className="font-semibold"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {isCollapsed ? (
                              <ChevronDownIcon className="size-4 shrink-0" />
                            ) : (
                              <ChevronUpIcon className="size-4 shrink-0" />
                            )}
                            <span className="truncate max-w-[200px]">
                              {formatEnumValueDisplay(groupName, "capitalize")}
                            </span>
                          </div>
                          {showGroupTotal && totalToShow && (
                            <span className="flex items-center font-normal text-muted-foreground gap-2">
                              Total:
                              <span className="font-medium">{totalToShow}</span>
                            </span>
                          )}
                        </div>
                        <span className="font-normal text-muted-foreground italic">
                          {groupRows.length}{" "}
                          {groupRows.length === 1 ? "item" : "itens"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {!isCollapsed &&
                    groupRows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="text-center"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })
          ) : (
            rowModel.rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-center"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )
        ) : isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <div className="flex items-center justify-center">
                <span className="flex items-center text-muted-foreground gap-3">
                  <MoonLoader size={22} color="#71717b" />
                  {"Carregando registros..."}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Nenhum resultado encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {showFooter && (
        <tfoot>
          <TableRow className="bg-accent/50 font-normal w-full">
            <TableCell
              colSpan={columns.length}
              className="text-center font-medium px-8"
            >
              {footerContent}
            </TableCell>
          </TableRow>
        </tfoot>
      )}
    </Table>
  );
}
