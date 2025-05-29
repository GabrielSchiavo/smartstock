"use client";

import { Button } from "@/components/ui/button";
import { FileTextIcon, PrinterIcon } from "lucide-react";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  LocaleType,
  PurchasedReportResponse,
  UnitType,
  ValidityReportResponse,
} from "@/types";
import { useReactToPrint } from "react-to-print";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
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
import React, { useRef, useState } from "react";
import { ToolTipHelpReport } from "@/components/report/tool-tip-help-report";
import { DataTableReportProps, ReportType } from "@/types";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Maximize2Icon,
  Minimize2Icon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  generateDonationsPdf,
  generateInventoryPdf,
  generatePurchasedPdf,
  generateValidityPdf,
} from "@/lib/pdf-generator";

export function DataTableReport<TData>({
  columns,
  data,
  initialDate,
  finalDate,
  reportType,
  groupBy,
}: DataTableReportProps<TData> & { groupBy?: keyof TData }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // Agrupa os dados se groupBy for especificado
  const groupedData = groupBy
    ? table
        .getRowModel()
        .rows.reduce((acc: Record<string, Row<TData>[]>, row) => {
          const groupValue = row.original[groupBy];
          const groupKey = String(groupValue);

          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(row);
          return acc;
        }, {})
    : null;

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

  const handleGeneratePdf = async () => {
    try {
      let pdf: Uint8Array;

      switch (reportType) {
        case ReportType.VALIDITY:
          pdf = await generateValidityPdf(
            data as ValidityReportResponse[],
            initialDate!.toISOString(),
            finalDate!.toISOString()
          );
          break;
        case ReportType.DONATIONS:
          pdf = await generateDonationsPdf(
            data as DonationsReportResponse[],
            initialDate!.toISOString(),
            finalDate!.toISOString()
          );
          break;
        case ReportType.PURCHASED:
          pdf = await generatePurchasedPdf(
            data as PurchasedReportResponse[],
            initialDate!.toISOString(),
            finalDate!.toISOString()
          );
          break;
        case ReportType.INVENTORY:
          pdf = await generateInventoryPdf(data as InventoryReportResponse[]);
          break;
        default:
          throw new Error("Tipo de relatório inválido");
      }

      if (!pdf) {
        throw new Error("Falha ao gerar PDF");
      }
      const pdfData = new Uint8Array(pdf);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-${
        reportType === ReportType.VALIDITY
          ? "validade"
          : reportType === ReportType.DONATIONS
            ? "doacoes"
            : reportType === ReportType.PURCHASED
              ? "comprados"
              : reportType === ReportType.INVENTORY
                ? "inventario"
                : "semnome"
      }-${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="grid gap-4 w-full">
      <div className="flex items-center justify-end gap-6 w-full">
        <ToolTipHelpReport />
        {groupBy && groupedData && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleAllGroups}>
                  {collapsedGroups.size === Object.keys(groupedData).length ? (
                    <Maximize2Icon className="h-4 w-4" />
                  ) : (
                    <Minimize2Icon className="h-4 w-4" />
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
        <Button
          onClick={reactToPrintFn}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <PrinterIcon />
          Imprimir
        </Button>
        <Button
          onClick={handleGeneratePdf}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <FileTextIcon />
          Gerar PDF
        </Button>
      </div>

      <div
        className="styleForPrint overflow-auto rounded-md border"
        ref={contentRef}
      >
        <div className="showForPrint space-y-3 mb-6">
          <h1 className="text-2xl font-semibold">
            Relatório de{" "}
            {reportType === ReportType.VALIDITY
              ? "Validade de Produtos"
              : reportType === ReportType.DONATIONS
                ? "Produtos Doados"
                : reportType === ReportType.PURCHASED
                  ? "Produtos Comprados"
                  : "Inventário"}
          </h1>
          {initialDate && finalDate && (
            <p className="text-md">
              Período:{" "}
              {new Date(initialDate).toLocaleDateString(LocaleType.PT_BR)} a{" "}
              {new Date(finalDate).toLocaleDateString(LocaleType.PT_BR)}
            </p>
          )}
        </div>
        <Table className="overflow-hidden!">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
            {table.getRowModel().rows?.length ? (
              groupBy && groupedData ? (
                // Renderização agrupada
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
                // Renderização normal (não agrupada)
                table.getRowModel().rows.map((row) => (
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

          {reportType === ReportType.PURCHASED && (
            <tfoot>
              <TableRow className="bg-accent/50 font-normal w-full">
                <TableCell
                  colSpan={columns.length}
                  className="text-center font-medium px-12"
                >
                  <div className="flex items-center justify-end gap-3">
                    Total:
                    {/* Calcula total para tabelas sem agrupamento */}
                    {getTotalValuesDisplayForData(data)}
                  </div>
                </TableCell>
              </TableRow>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
}
