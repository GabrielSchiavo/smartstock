"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/tables/_components/data-table-toolbar";
import { DataTablePagination } from "@/components/tables/_components/data-table-pagination";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Maximize2Icon,
  Minimize2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableProps } from "@/types";
import { useGroupedTable } from "@/hooks/use-grouped-table";
import { getTotalValuesDisplayForData } from "@/components/utils/group-table";

export function DataTableProducts<TData, TValue>({
  columns,
  data,
  addButton,
  groupBy,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(
    new Set()
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const rowModel = table.getRowModel();

  // Agrupa os dados se groupBy for especificado
  const {
    groupedData,
    toggleGroup,
    toggleAllGroups,
  } = useGroupedTable({
    table,
    groupBy,
    collapsedGroups,
    setCollapsedGroups,
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-2 items-center justify-between">
        <DataTableToolbar
          toolTip={true}
          addButton={addButton}
          addButtonType={"PRODUCT"}
          table={table}
        />
        {groupBy && groupedData && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAllGroups}
                  className="ml-auto"
                >
                  {collapsedGroups.size === Object.keys(groupedData).length ? (
                    <Maximize2Icon />
                  ) : (
                    <Minimize2Icon />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {collapsedGroups.size === Object.keys(groupedData).length
                    ? "Expandir todos"
                    : "Recolher todos"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-center!">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center!">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rowModel.rows?.length ? (
              groupBy && groupedData ? (
                // Render grouped rows with toggle functionality
                Object.entries(groupedData).map(([groupName, groupRows]) => {
                  const isCollapsed = collapsedGroups.has(groupName);

                  // Calcula o total para tabela com agrupamento
                  const totalToShow = getTotalValuesDisplayForData(
                    groupRows.map((row) => row.original)
                  );

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
                                  <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                  <ChevronUpIcon className="h-4 w-4" />
                                )}
                                <span className="truncate max-w-[200px]">
                                  {groupName}
                                </span>
                              </div>
                              <span className="flex items-center font-normal text-muted-foreground gap-2">
                                Total:
                                <span className="font-medium">
                                  {totalToShow}
                                </span>
                              </span>
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
                // Render normal rows
                rowModel.rows.map((row) => (
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
                ))
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {
            <tfoot>
              <TableRow className="bg-accent/50 font-normal w-full">
                <TableCell
                  colSpan={columns.length}
                  className="text-center font-medium px-8"
                >
                  <div className="flex items-center justify-start gap-2">
                    TOTAL FINAL:
                    {/* Calcula total para tabelas sem agrupamento */}
                    <span>{getTotalValuesDisplayForData(data)}</span>
                  </div>
                </TableCell>
              </TableRow>
            </tfoot>
          }
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
