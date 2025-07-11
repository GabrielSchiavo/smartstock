"use client";

import { Button } from "@/components/ui/button";
import { FileTextIcon, PrinterIcon } from "lucide-react";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  PurchasedReportResponse,
  ToastType,
  ValidityReportResponse,
} from "@/types";
import { useReactToPrint } from "react-to-print";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
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
import {
  generateDonationsPdf,
  generateInventoryPdf,
  generatePurchasedPdf,
  generateValidityPdf,
} from "@/lib/pdf-generator";
import { useGroupedTable } from "@/hooks/use-grouped-table";
import { getTotalValuesDisplayForData } from "@/components/utils/group-table";
import { showToast } from "@/components/utils/show-toast";
import { formatDateToLocale } from "@/lib/date-utils";

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
  const { groupedData, toggleGroup, toggleAllGroups } = useGroupedTable({
    table,
    groupBy,
    collapsedGroups,
    setCollapsedGroups,
  });

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
          throw showToast({
            title: "Erro!",
            description: "Tipo de relatório inválido.",
            type: ToastType.ERROR,
          });
      }

      if (!pdf) {
        showToast({
          title: "Erro!",
          description: "Erro ao gerar o PDF.",
          type: ToastType.ERROR,
        });
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
      console.error("Erro ao gerar PDF:", error);
      showToast({
        title: "Erro!",
        description: "Erro ao gerar o PDF.",
        type: ToastType.ERROR,
      });
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
                    ? "Expandir Grupos"
                    : "Recolher Grupos"}
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
        className="styleForPrint rounded-xl border overflow-auto"
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
              {formatDateToLocale(new Date(initialDate))}{" "}
              a{" "}
              {formatDateToLocale(new Date(finalDate))}
            </p>
          )}
        </div>
        <Table className="overflow-hidden!">
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
          {reportType === ReportType.VALIDITY && (
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
          )}
          {reportType === ReportType.DONATIONS && (
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
          )}
          {reportType === ReportType.PURCHASED && (
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
          )}
          {reportType === ReportType.INVENTORY && (
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
          )}
        </Table>
      </div>
    </div>
  );
}
