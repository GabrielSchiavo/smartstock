"use client";

import { Button } from "@/components/ui/button";
import { FileTextIcon, PrinterIcon } from "lucide-react";
import {
  DonationsReport,
  InventoryReport,
  PurchasedReport,
  ValidityReport,
} from "@/actions/report";
import { useReactToPrint } from "react-to-print";

import {
  ColumnDef,
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
import {
  generateDonationsPdf,
  generateInventoryPdf,
  generatePurchasedPdf,
  generateValidityPdf,
} from "@/lib/pdf-generator";
import { toast } from "sonner";
import React, { useRef } from "react";
import { ToolTipHelpReport } from "@/components/report/tool-tip-help-report";
import { ReportType } from "@/types";

interface DataTableReportProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  initialDate?: Date;
  finalDate?: Date;
  reportType: ReportType.VALIDITY | ReportType.DONATIONS | ReportType.PURCHASED | ReportType.INVENTORY;
}

export function DataTableReport<T>({
  columns,
  data,
  initialDate,
  finalDate,
  reportType,
}: DataTableReportProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

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

  const handleGeneratePdf = async () => {
    try {
      let pdf: Uint8Array;

      switch (reportType) {
        case ReportType.VALIDITY:
          pdf = await generateValidityPdf(
            data as ValidityReport[],
            initialDate!.toISOString(),
            finalDate!.toISOString()
          );
          break;
        case ReportType.DONATIONS:
          pdf = await generateDonationsPdf(
            data as DonationsReport[],
            initialDate!.toISOString(),
            finalDate!.toISOString()
          );
          break;
        case ReportType.PURCHASED:
          pdf = await generatePurchasedPdf(
            data as PurchasedReport[],
            initialDate!.toISOString(),
            finalDate!.toISOString()
          );
          break;
        case ReportType.INVENTORY:
          pdf = await generateInventoryPdf(data as InventoryReport[]);
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
                  : ""}
          </h1>
          <p className="text-md">
            Período: {new Date(initialDate!).toLocaleDateString()} a{" "}
            {new Date(finalDate!).toLocaleDateString()}
          </p>
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
        </Table>
      </div>
    </div>
  );
}
