// src/components/pdf/ValidityPdfGenerator.ts
import { BasePdfGenerator } from "@/lib/base-pdf-generator";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  PurchasedReportResponse,
  ValidityReportResponse,
} from "@/types";
import { ProductType } from "@/types";

export class ValidityPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: ValidityReportResponse[],
    private initialDate: string,
    private finalDate: string
  ) {
    super(BasePdfGenerator.PDF_CONFIG);
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Validade de Produtos");
    this.addSubtitle(
      `Período: ${this.formatDate(this.initialDate)} a ${this.formatDate(this.finalDate)}`
    );

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Peso Uni.",
      "Lote",
      "Validade",
      "Dias p/ Vencer",
      "Status",
    ];
    const columnWidths = [10, 100, 30, 30, 40, 30, 30, 20];

    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      `${item.unitWeight ?? "-"} ${item.unitOfUnitWeight ?? "-"}`,
      item.lot,
      this.formatDate(item.validityDate.toString()),
      item.daysUntilExpiry > 0 ? item.daysUntilExpiry.toString() : "Vencido",
      this.getStatusText(item.status),
    ]);

    this.addTable(headers, columnWidths, rows);
    this.addFooter();

    return this.doc.output("arraybuffer");
  }
}

export const generateValidityPdf = async (
  data: ValidityReportResponse[],
  initialDate: string,
  finalDate: string
): Promise<Uint8Array> => {
  const generator = new ValidityPdfGenerator(data, initialDate, finalDate);
  return generator.generate();
};

// Donations PDF Generator
export class DonationsPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: DonationsReportResponse[],
    private initialDate: string,
    private finalDate: string
  ) {
    super(BasePdfGenerator.PDF_CONFIG);
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Doações de Produtos");
    this.addSubtitle(
      `Período: ${this.formatDate(this.initialDate)} a ${this.formatDate(this.finalDate)}`
    );

    // Group data by supplier
    const suppliersMap = new Map<string, DonationsReportResponse[]>();
    this.data.forEach((item) => {
      const supplierItems = suppliersMap.get(item.supplier) || [];
      supplierItems.push(item);
      suppliersMap.set(item.supplier, supplierItems);
    });

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Peso Uni.",
      "Fornecedor",
      "Data de Receb.",
    ];
    const columnWidths = [10, 120, 30, 30, 50, 40];

    for (const [supplier, items] of suppliersMap) {
      this.checkPageBreak(50);

      // Add supplier header
      this.doc.setFontSize(this.COMMON_STYLES.sectionHeaderFont.size);
      this.doc.setFont("helvetica", this.COMMON_STYLES.sectionHeaderFont.style);
      this.doc.text(`Fornecedor: ${supplier}`, this.margins.left, this.currentY);
      this.currentY += 10;

      // Add items table
      const rows = items.map((item) => [
        item.id.toString(),
        item.name,
        `${item.quantity} ${item.unit}`,
        `${item.unitWeight ?? "-"} ${item.unitOfUnitWeight ?? "-"}`,
        item.supplier,
        this.formatDate(item.receiptDate.toString()),
      ]);

      this.addTable(headers, columnWidths, rows);

      this.addHorizontalLine(this.currentY);
      this.currentY += 5;

      // Add supplier totals
      const totals = this.calculateTotals(items);
      const formatted = this.formatTotalValues(items, totals);
      this.addTotalSection("TOTAL", formatted);

      this.currentY -= 2;
      this.addHorizontalLine(this.currentY);

      this.currentY += 15;
    }

    // Add grand totals
    this.checkPageBreak(20);
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    const grandTotals = this.calculateTotals(this.data);
    const grandFormatted = this.formatTotalValues(this.data, grandTotals);
    this.addTotalSection("TOTAL GERAL", grandFormatted, true);

    this.currentY -= 2;
    this.addHorizontalLine(this.currentY);

    this.addFooter();
    return this.doc.output("arraybuffer");
  }
}

export const generateDonationsPdf = async (
  data: DonationsReportResponse[],
  initialDate: string,
  finalDate: string
): Promise<Uint8Array> => {
  const generator = new DonationsPdfGenerator(data, initialDate, finalDate);
  return generator.generate();
};

// Purchased PDF Generator
export class PurchasedPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: PurchasedReportResponse[],
    private initialDate: string,
    private finalDate: string
  ) {
    super(BasePdfGenerator.PDF_CONFIG);
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Produtos Comprados");
    this.addSubtitle(
      `Período: ${this.formatDate(this.initialDate)} a ${this.formatDate(this.finalDate)}`
    );

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Peso Uni.",
      "Data de Receb.",
    ];
    const columnWidths = [10, 120, 30, 30, 50];

    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      `${item.unitWeight ?? "-"} ${item.unitOfUnitWeight ?? "-"}`,
      this.formatDate(item.receiptDate.toString()),
    ]);

    this.addTable(headers, columnWidths, rows);

    this.checkPageBreak(20);
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    const totals = this.calculateTotals(this.data);
    const formattedTotals = this.formatTotalValues(this.data, totals);
    this.addTotalSection("TOTAL GERAL", formattedTotals, true);

    this.currentY -= 2;
    this.addHorizontalLine(this.currentY);

    this.addFooter();
    return this.doc.output("arraybuffer");
  }
}

export const generatePurchasedPdf = async (
  data: PurchasedReportResponse[],
  initialDate: string,
  finalDate: string
): Promise<Uint8Array> => {
  const generator = new PurchasedPdfGenerator(data, initialDate, finalDate);
  return generator.generate();
};

// Inventory PDF Generator
export class InventoryPdfGenerator extends BasePdfGenerator {
  constructor(private data: InventoryReportResponse[]) {
    super(BasePdfGenerator.PDF_CONFIG);
  }

  private groupByGroup(items: InventoryReportResponse[]) {
    const groupsMap = new Map<string, InventoryReportResponse[]>();

    items.forEach((item) => {
      const groupName = item.group || "Sem Grupo";
      const groupItems = groupsMap.get(groupName) || [];
      groupItems.push(item);
      groupsMap.set(groupName, groupItems);
    });

    return groupsMap;
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Inventário de Produtos");
    this.addSubtitle(
      `Data de geração: ${this.formatDate(new Date().toISOString())}`
    );

    // Group data by group
    const groupsMap = this.groupByGroup(this.data);
    const sortedGroups = Array.from(groupsMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Peso Uni.",
      "Lote",
      "Validade",
      "Tipo",
      "Dias p/ Vencer",
      "Status",
    ];
    const columnWidths = [10, 100, 20, 20, 30, 30, 20, 30, 20];

    const grandTotals = { weight: 0, volume: 0, units: 0 };

    for (const [groupName, groupItems] of sortedGroups) {
      this.checkPageBreak(40);

      // Group header
      this.doc.setFontSize(this.COMMON_STYLES.sectionHeaderFont.size);
      this.doc.setFont("helvetica", this.COMMON_STYLES.sectionHeaderFont.style);
      this.doc.text(`Grupo: ${groupName}`, this.margins.left, this.currentY);
      this.currentY += 8;

      // Add items table
      const rows = groupItems.map((item) => [
        item.id.toString(),
        item.name,
        `${item.quantity} ${item.unit}`,
        `${item.unitWeight ?? "-"} ${item.unitOfUnitWeight ?? "-"}`,
        item.lot,
        this.formatDate(item.validityDate.toString()),
        item.productType === ProductType.PURCHASED ? "Comprado" : "Doado",
        item.daysUntilExpiry > 0 ? item.daysUntilExpiry.toString() : "Vencido",
        this.getStatusText(item.status),
      ]);

      this.addTable(headers, columnWidths, rows);

      // Calculate and show group totals
      const groupTotals = this.calculateTotals(groupItems);
      grandTotals.weight += groupTotals.weight;
      grandTotals.volume += groupTotals.volume;
      grandTotals.units += groupTotals.units;

      this.currentY += 5;
      this.addHorizontalLine(this.currentY);
      this.currentY += 5;

      const formattedTotals = this.formatTotalValues(groupItems, groupTotals);
      this.addTotalSection("TOTAL DO GRUPO", formattedTotals);

      this.currentY -= 2;
      this.addHorizontalLine(this.currentY);

      this.currentY += 15;
    }

    // Add grand totals
    this.checkPageBreak(20);
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    const grandFormatted = this.formatTotalValues(this.data, grandTotals);
    this.addTotalSection("TOTAL GERAL", grandFormatted, true);

    this.currentY -= 2;
    this.addHorizontalLine(this.currentY);

    this.addFooter();
    return this.doc.output("arraybuffer");
  }
}

export const generateInventoryPdf = async (
  data: InventoryReportResponse[]
): Promise<Uint8Array> => {
  const generator = new InventoryPdfGenerator(data);
  return generator.generate();
};
