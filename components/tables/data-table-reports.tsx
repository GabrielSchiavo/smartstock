"use client";

import { Button } from "@/components/ui/button";
import { FileTextIcon, PrinterIcon } from "lucide-react";
import {
  CalculableTotalItemProps,
  DonationsReportResponse,
  InventoryReportResponse,
  PurchasedReportResponse,
  ToastType,
  ValidityReportResponse,
} from "@/types";
import { useReactToPrint } from "react-to-print";
import {
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useRef, useState } from "react";
import { DataTableReportProps, ReportType } from "@/types";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
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
import { formatDateToLocale } from "@/utils/date-utils";
import { BaseDataTable } from "@/components/tables/base-data-table";
import { ToolTipHelp, TooltipItem } from "@/components/shared/tool-tip-help";

export function DataTableReport<TData>({
  columns,
  data,
  initialDate,
  finalDate,
  reportType,
  groupBy,
}: DataTableReportProps<TData>) {
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
        <ToolTipHelp>
          <TooltipItem>
            <p className="text-sm">
              <span className="font-semibold">Ordenação</span> - Use a opção{" "}
              <span className="font-semibold italic">Imprimir</span> para salvar
              o relatório com a ordenação de registros personalizada.
            </p>
          </TooltipItem>
        </ToolTipHelp>
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
              Período: {formatDateToLocale(new Date(initialDate))} a{" "}
              {formatDateToLocale(new Date(finalDate))}
            </p>
          )}
        </div>
        <div className="rounded-xl border overflow-hidden">
          <BaseDataTable
            table={table}
            columns={columns}
            groupedData={groupedData as Record<string, Row<TData>[]>}
            collapsedGroups={collapsedGroups}
            toggleGroup={toggleGroup}
            showGroupTotal={true}
            showFooter={reportType !== undefined}
            footerContent={
              <div className="flex items-center justify-start gap-2">
                TOTAL FINAL:
                <span>
                  {getTotalValuesDisplayForData(
                    data as CalculableTotalItemProps[]
                  )}
                </span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
