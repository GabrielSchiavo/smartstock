import { DataTableReport } from "@/components/tables/data-table-reports";
import {
  columnsTableReportInventory,
  columnsTableReportPurchased,
  columnsTableReportReceivers,
  columnsTableReportStockMovements,
  columnsTableReportSuppliers,
  columnsTableReportValidity,
} from "@/components/tables/_columns/columns-table-reports";
import { columnsTableReportDonations } from "@/components/tables/_columns/columns-table-reports";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  PurchasedReportResponse,
  ReportType,
  ClientDataTableReportProps,
  StockMovementReportResponse,
  ValidityReportResponse,
  ReceiversReportResponse,
  SuppliersReportResponse,
} from "@/types";

export const ClientDataTableReport = ({
  reportType,
  reportData,
  dates,
}: ClientDataTableReportProps) => {
  // Se não há dados, exibe mensagem
  if (reportData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col gap-12 w-full md:max-w-4xl">
          <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
            <p className="text-base text-center text-muted-foreground">
              Nenhum registro encontrado para o período selecionado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza a tabela baseada no tipo de relatório
  switch (reportType) {
    case ReportType.VALIDITY:
      return (
        <DataTableReport<ValidityReportResponse>
          columns={columnsTableReportValidity}
          data={reportData as ValidityReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.VALIDITY}
        />
      );

    case ReportType.DONATIONS:
      return (
        <DataTableReport<DonationsReportResponse>
          columns={columnsTableReportDonations}
          data={reportData as DonationsReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.DONATIONS}
          groupBy="supplier"
        />
      );

    case ReportType.PURCHASED:
      return (
        <DataTableReport<PurchasedReportResponse>
          columns={columnsTableReportPurchased}
          data={reportData as PurchasedReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.PURCHASED}
          groupBy="supplier"
        />
      );

    case ReportType.RECEIVERS:
      return (
        <DataTableReport<ReceiversReportResponse>
          columns={columnsTableReportReceivers}
          data={reportData as ReceiversReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.RECEIVERS}
          groupBy="receiver"
        />
      );

    case ReportType.SUPPLIERS:
      return (
        <DataTableReport<SuppliersReportResponse>
          columns={columnsTableReportSuppliers}
          data={reportData as SuppliersReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.SUPPLIERS}
          groupBy="supplier"
        />
      );

    case ReportType.INVENTORY:
      return (
        <DataTableReport<InventoryReportResponse>
          columns={columnsTableReportInventory}
          data={reportData as InventoryReportResponse[]}
          reportType={ReportType.INVENTORY}
          groupBy="group"
        />
      );

    case ReportType.INPUTS:
      return (
        <DataTableReport<StockMovementReportResponse>
          columns={columnsTableReportStockMovements}
          data={reportData as StockMovementReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.INPUTS}
          groupBy="movementCategory"
        />
      );

    case ReportType.OUTPUTS:
      return (
        <DataTableReport<StockMovementReportResponse>
          columns={columnsTableReportStockMovements}
          data={reportData as StockMovementReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.OUTPUTS}
          groupBy="movementCategory"
        />
      );

    case ReportType.ADJUSTMENTS:
      return (
        <DataTableReport<StockMovementReportResponse>
          columns={columnsTableReportStockMovements}
          data={reportData as StockMovementReportResponse[]}
          initialDate={dates?.initialDate}
          finalDate={dates?.finalDate}
          reportType={ReportType.ADJUSTMENTS}
          groupBy="movementType"
        />
      );

    default:
      return null;
  }
};
