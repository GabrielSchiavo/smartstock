// src/components/pdf/ValidityPdfGenerator.ts
import { BasePdfGenerator } from "@/lib/base-pdf-generator";
import {
  DonationsReport,
  InventoryReport,
  PurchasedReport,
  ValidityReport,
} from "@/actions/report";
import { ProductType } from "@/types/index.enums";

export class ValidityPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: ValidityReport[],
    private initialDate: string,
    private finalDate: string
  ) {
    super({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Validade de Produtos");
    this.addSubtitle(
      `Período: ${new Date(this.initialDate).toLocaleDateString("pt-BR")} a ${new Date(
        this.finalDate
      ).toLocaleDateString("pt-BR")}`
    );

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Lote",
      "Validade",
      "Dias p/ Vencer",
      "Status",
    ];
    const columnWidths = [10, 120, 20, 40, 30, 20, 20];

    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      item.lot,
      new Date(item.validityDate).toLocaleDateString(),
      item.daysUntilExpiry > 0 ? item.daysUntilExpiry.toString() : "Vencido",
      this.getStatusText(item.status),
    ]);

    this.addTable(headers, columnWidths, rows);

    this.addFooter(); 
    return this.doc.output("arraybuffer");
  }

  private getStatusText(status: string): string {
    switch (status) {
      case "expired":
        return "Vencido";
      case "about_to_expire":
        return "Próximo";
      default:
        return "Válido";
    }
  }
}

export const generateValidityPdf = async (
  data: ValidityReport[],
  initialDate: string,
  finalDate: string
): Promise<Uint8Array> => {
  const generator = new ValidityPdfGenerator(data, initialDate, finalDate);
  return generator.generate();
};

export class DonationsPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: DonationsReport[],
    private initialDate: string,
    private finalDate: string
  ) {
    super({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Doações de Produtos");
    this.addSubtitle(
      `Período: ${new Date(this.initialDate).toLocaleDateString("pt-BR")} a ${new Date(
        this.finalDate
      ).toLocaleDateString("pt-BR")}`
    );

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Doador",
      "Data de Recebimento",
    ];
    const columnWidths = [10, 120, 20, 70, 50];

    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      item.donor,
      new Date(item.receiptDate).toLocaleDateString("pt-BR"),
    ]);

    this.addTable(headers, columnWidths, rows);

    this.addFooter(); 
    return this.doc.output("arraybuffer");
  }
}

export const generateDonationsPdf = async (
  data: DonationsReport[],
  initialDate: string,
  finalDate: string
): Promise<Uint8Array> => {
  const generator = new DonationsPdfGenerator(data, initialDate, finalDate);
  return generator.generate();
};

export class PurchasedPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: PurchasedReport[],
    private initialDate: string,
    private finalDate: string
  ) {
    super({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Produtos Comprados");
    this.addSubtitle(
      `Período: ${new Date(this.initialDate).toLocaleDateString("pt-BR")} a ${new Date(
        this.finalDate
      ).toLocaleDateString("pt-BR")}`
    );

    const headers = ["ID", "Produto", "Quantidade", "Data de Recebimento"];
    const columnWidths = [10, 120, 20, 50];
    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      new Date(item.receiptDate).toLocaleDateString("pt-BR"),
    ]);

    this.addTable(headers, columnWidths, rows);

    this.addFooter();
    return this.doc.output("arraybuffer");
  }
}

export const generatePurchasedPdf = async (
  data: PurchasedReport[],
  initialDate: string,
  finalDate: string
): Promise<Uint8Array> => {
  const generator = new PurchasedPdfGenerator(data, initialDate, finalDate);
  return generator.generate();
};

export class InventoryPdfGenerator extends BasePdfGenerator {
  constructor(private data: InventoryReport[]) {
    super({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Inventário de Produtos");
    this.addSubtitle(`Data de geração: ${new Date().toLocaleDateString("pt-BR")}`);

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Lote",
      "Validade",
      "Tipo",
      "Dias p/ Vencer",
      "Status",
    ];
    const columnWidths = [10, 100, 20, 40, 30, 20, 30, 20];

    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      item.lot,
      new Date(item.validityDate).toLocaleDateString("pt-BR"),
      item.productType === ProductType.PURCHASED ? "Comprado" : "Doado",
      item.daysUntilExpiry > 0 ? item.daysUntilExpiry.toString() : "Vencido",
      this.getStatusText(item.status),
    ]);

    this.addTable(headers, columnWidths, rows);
    this.addFooter();
    return this.doc.output("arraybuffer");
  }

  private getStatusText(status: string): string {
    switch (status) {
      case "expired":
        return "Vencido";
      case "about_to_expire":
        return "Próximo";
      default:
        return "Válido";
    }
  }
}

export const generateInventoryPdf = async (
  data: InventoryReport[]
): Promise<Uint8Array> => {
  const generator = new InventoryPdfGenerator(data);
  return generator.generate();
};
