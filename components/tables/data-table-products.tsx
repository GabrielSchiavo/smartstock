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
  Row,
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
import { DataTableProps, LocaleType, UnitType } from "@/types";

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

  // Extract row model to a separate variable for the dependency array
  const rowModel = table.getRowModel();

  const groupedData = React.useMemo(() => {
    if (!groupBy) return null;

    return rowModel.rows.reduce((acc: Record<string, Row<TData>[]>, row) => {
      const groupValue = row.original[groupBy];
      const groupKey = String(groupValue);

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(row);
      return acc;
    }, {});
  }, [rowModel.rows, groupBy]);

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
      // All groups are collapsed, so expand all
      setCollapsedGroups(new Set());
    } else {
      // Collapse all groups
      setCollapsedGroups(new Set(Object.keys(groupedData)));
    }
  };

  // Calcula totais para cada grupo ou para a tabela inteira
  const getTotalValuesDisplayForData = (data: TData[]) => {
    const totalValues = data.reduce(
      (total, item) => {
        const original = item as unknown as {
          quantity?: number;
          unit?: UnitType;
          unitWeight?: number;
          unitOfUnitWeight?: UnitType;
        };

        const quantity = original.quantity || 0;
        const unit = original.unit;
        const unitWeight = original.unitWeight || 0;
        const unitOfUnitWeight = original.unitOfUnitWeight || UnitType.KG;

        let itemWeight = 0;
        let itemVolume = 0;

        if (unit === UnitType.KG) {
          itemWeight = quantity;
        } else if (unit === UnitType.G) {
          itemWeight = quantity / 1000;
        } else if (unit === UnitType.L) {
          itemVolume = quantity;
        } else if (unit === UnitType.UN) {
          if (unitOfUnitWeight === UnitType.G) {
            itemWeight = quantity * (unitWeight / 1000);
          } else if (unitOfUnitWeight === UnitType.L) {
            itemVolume = quantity * unitWeight;
          } else {
            itemWeight = quantity * unitWeight;
          }
        }

        return {
          weight: total.weight + itemWeight,
          volume: total.volume + itemVolume,
        };
      },
      { weight: 0, volume: 0 }
    );

    const hasUnit = (unitTypes: UnitType[]) =>
      data.some((item) => {
        const product = item as unknown as {
          unit?: UnitType;
          unitOfUnitWeight?: UnitType;
        };
        return (
          unitTypes.includes(product.unit!) ||
          (product.unit === UnitType.UN &&
            unitTypes.includes(product.unitOfUnitWeight!))
        );
      });

    const format = (value: number, unit: string) =>
      Number(value.toFixed(3)).toLocaleString(LocaleType.PT_BR, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      }) + ` ${unit}`;

    const hasLiters = hasUnit([UnitType.L]);
    const hasKilos =
      hasUnit([UnitType.KG, UnitType.G]) ||
      (hasUnit([UnitType.UN]) && !hasUnit([UnitType.L]));

    return hasKilos && hasLiters ? (
      <span className="flex items-center gap-2">
        <span>{format(totalValues.weight, "KG")}</span>
        <span>{" & "}</span>
        <span>{format(totalValues.volume, "L")}</span>
      </span>
    ) : hasLiters ? (
      format(totalValues.volume, "L")
    ) : (
      format(totalValues.weight, "KG")
    );
  };

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-center">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  <div className="flex items-center justify-start gap-3">
                    TOTAL FINAL:
                    {/* Calcula total para tabelas sem agrupamento */}
                    {getTotalValuesDisplayForData(data)}
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
