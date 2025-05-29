// src/components/pdf/ValidityPdfGenerator.ts
import { BasePdfGenerator } from "@/lib/base-pdf-generator";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  LocaleType,
  PurchasedReportResponse,
  ValidityReportResponse,
} from "@/types";
import { PdfUnitType, ProductType, validityStatusType } from "@/types";

export class ValidityPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: ValidityReportResponse[],
    private initialDate: string,
    private finalDate: string
  ) {
    super({
      orientation: "landscape",
      unit: PdfUnitType.MM,
      format: PdfUnitType.A4,
    });
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Validade de Produtos");
    this.addSubtitle(
      `Período: ${new Date(this.initialDate).toLocaleDateString(LocaleType.PT_BR)} a ${new Date(
        this.finalDate
      ).toLocaleDateString(LocaleType.PT_BR)}`
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
    const columnWidths = [10, 100, 20, 20, 40, 30, 30, 20];

    const rows = this.data.map((item) => [
      item.id.toString(),
      item.name,
      `${item.quantity} ${item.unit}`,
      `${item.unitWeight === null ? `-` : item.unitWeight} ${item.unitOfUnitWeight === null ? `-` : item.unitOfUnitWeight}`,
      item.lot,
      new Date(item.validityDate).toLocaleDateString(LocaleType.PT_BR),
      item.daysUntilExpiry > 0 ? item.daysUntilExpiry.toString() : "Vencido",
      this.getStatusText(item.status),
    ]);

    this.addTable(headers, columnWidths, rows);

    this.addFooter();
    return this.doc.output("arraybuffer");
  }

  private getStatusText(status: string): string {
    switch (status) {
      case validityStatusType.EXPIRED:
        return "Vencido";
      case validityStatusType.ABOUT_TO_EXPIRE:
        return "Próximo";
      default:
        return "Válido";
    }
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

export class DonationsPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: DonationsReportResponse[],
    private initialDate: string,
    private finalDate: string
  ) {
    super({
      orientation: "landscape",
      unit: PdfUnitType.MM,
      format: PdfUnitType.A4,
    });
  }

  private addHorizontalLine(yPosition: number): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    this.doc.setDrawColor(200, 200, 200); // Cor cinza claro
    this.doc.setLineWidth(0.2); // Espessura da linha
    this.doc.line(
      this.margins.left, // X inicial
      yPosition, // Y
      pageWidth - this.margins.right, // X final
      yPosition // Y
    );
  }

  private convertToKg(weight: number, unit: string): number {
    if (!weight) return 0;

    switch (unit?.toUpperCase()) {
      case "G":
        return weight / 1000;
      case "KG":
      default:
        return weight;
    }
  }

  private convertToLiters(volume: number, unit: string): number {
    if (!volume) return 0;

    switch (unit?.toUpperCase()) {
      case "L":
      default:
        return volume;
    }
  }

  private calculateTotals(items: DonationsReportResponse[]) {
    return items.reduce(
      (total, item) => {
        const quantity = item.quantity || 0;
        const unit = item.unit?.toUpperCase();
        const unitWeight = item.unitWeight || 0;
        const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase() || "KG";

        let itemWeight = 0;
        let itemVolume = 0;

        if (unit === "KG" || unit === "G") {
          itemWeight = this.convertToKg(quantity, unit);
        } else if (unit === "L") {
          itemVolume = this.convertToLiters(quantity, unit);
        } else if (unit === "UN") {
          if (unitOfUnitWeight === "L") {
            itemVolume = this.convertToLiters(
              quantity * unitWeight,
              unitOfUnitWeight
            );
          } else {
            itemWeight = this.convertToKg(
              quantity * unitWeight,
              unitOfUnitWeight
            );
          }
        }

        return {
          weight: total.weight + itemWeight,
          volume: total.volume + itemVolume,
        };
      },
      { weight: 0, volume: 0 }
    );
  }

  private hasUnit(items: DonationsReportResponse[], unitTypes: string[]) {
    return items.some((item) => {
      const unit = item.unit?.toUpperCase();
      const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase();

      return (
        unitTypes.includes(unit!) ||
        (unit === "UN" &&
          unitOfUnitWeight &&
          unitTypes.includes(unitOfUnitWeight))
      );
    });
  }

  private formatTotalValues(
    items: DonationsReportResponse[],
    totalValues: { weight: number; volume: number }
  ) {
    const hasLiters = this.hasUnit(items, ["L"]);
    const hasKilos =
      this.hasUnit(items, ["KG", "G"]) ||
      (this.hasUnit(items, ["UN"]) && !hasLiters);

    if (hasKilos && hasLiters) {
      return `${totalValues.weight.toFixed(3)} KG & ${totalValues.volume.toFixed(3)} L`;
    } else if (hasLiters) {
      return `${totalValues.volume.toFixed(3)} L`;
    }
    return `${totalValues.weight.toFixed(3)} KG`;
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Doações de Produtos");
    this.addSubtitle(
      `Período: ${new Date(this.initialDate).toLocaleDateString(LocaleType.PT_BR)} a ${new Date(
        this.finalDate
      ).toLocaleDateString(LocaleType.PT_BR)}`
    );

    this.currentY += 10;

    // Agrupar dados por doador
    const donorsMap = new Map<string, DonationsReportResponse[]>();
    this.data.forEach((item) => {
      const donorItems = donorsMap.get(item.donor) || [];
      donorItems.push(item);
      donorsMap.set(item.donor, donorItems);
    });

    const headers = [
      "ID",
      "Produto",
      "Quantidade",
      "Peso Uni.",
      "Doador",
      "Data de Receb.",
    ];
    const columnWidths = [10, 120, 30, 30, 50, 40];

    for (const [donor, items] of donorsMap) {
      // Verificar espaço necessário para próxima seção (título + tabela + totais)
      this.checkPageBreak(50);

      // Adicionar cabeçalho do doador
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bolditalic");
      this.doc.text(`Doador: ${donor}`, this.margins.left, this.currentY);
      this.currentY += 10;

      // Adicionar tabela de itens
      const rows = items.map((item) => [
        item.id.toString(),
        item.name,
        `${item.quantity} ${item.unit}`,
        `${item.unitWeight ?? "-"} ${item.unitOfUnitWeight ?? "-"}`,
        item.donor,
        new Date(item.receiptDate).toLocaleDateString(LocaleType.PT_BR),
      ]);

      this.addTable(headers, columnWidths, rows);

      // this.currentY += 5;
      this.addHorizontalLine(this.currentY);
      this.currentY += 5;

      // Adicionar totais do doador
      const totals = this.calculateTotals(items);
      const formatted = this.formatTotalValues(items, totals);

      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("TOTAL DO DOADOR: ", this.margins.left, this.currentY);

      // Adiciona os valores ao lado, sem negrito
      const labelWidth = this.doc.getTextWidth("TOTAL DO DOADOR: ");
      this.doc.setFont("helvetica", "normal");
      this.doc.text(formatted, this.margins.left + labelWidth, this.currentY);

      this.currentY += 3;
      this.addHorizontalLine(this.currentY);
      this.currentY += 5;

      this.currentY += 15; // Espaço para próxima seção
    }
    // Adicionar totais gerais
    this.checkPageBreak(20);
    this.currentY += 5;
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    const grandTotals = this.calculateTotals(this.data);
    const grandFormatted = this.formatTotalValues(this.data, grandTotals);

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("TOTAL GERAL: ", this.margins.left, this.currentY);

    // Adiciona os valores ao lado, sem negrito
    const labelWidth = this.doc.getTextWidth("TOTAL GERAL: ");
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      grandFormatted,
      this.margins.left + labelWidth,
      this.currentY
    );

    this.currentY += 3;
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

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

export class PurchasedPdfGenerator extends BasePdfGenerator {
  constructor(
    private data: PurchasedReportResponse[],
    private initialDate: string,
    private finalDate: string
  ) {
    super({
      orientation: "landscape",
      unit: PdfUnitType.MM,
      format: PdfUnitType.A4,
    });
  }

  private addHorizontalLine(yPosition: number): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    this.doc.setDrawColor(200, 200, 200); // Cor cinza claro
    this.doc.setLineWidth(0.2); // Espessura da linha
    this.doc.line(
      this.margins.left, // X inicial
      yPosition, // Y
      pageWidth - this.margins.right, // X final
      yPosition // Y
    );
  }

  private convertToKg(weight: number, unit: string): number {
    if (!weight) return 0;

    switch (unit?.toUpperCase()) {
      case "G":
        return weight / 1000;
      case "KG":
      default:
        return weight;
    }
  }

  private convertToLiters(volume: number, unit: string): number {
    if (!volume) return 0;

    switch (unit?.toUpperCase()) {
      case "L":
      default:
        return volume;
    }
  }

  private calculateTotals() {
    return this.data.reduce(
      (total, item) => {
        const quantity = item.quantity || 0;
        const unit = item.unit?.toUpperCase();
        const unitWeight = item.unitWeight || 0;
        const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase() || "KG";

        let itemWeight = 0;
        let itemVolume = 0;

        if (unit === "KG" || unit === "G") {
          itemWeight = this.convertToKg(quantity, unit);
        } else if (unit === "L") {
          itemVolume = this.convertToLiters(quantity, unit);
        } else if (unit === "UN") {
          if (unitOfUnitWeight === "L") {
            itemVolume = this.convertToLiters(
              quantity * unitWeight,
              unitOfUnitWeight
            );
          } else {
            itemWeight = this.convertToKg(
              quantity * unitWeight,
              unitOfUnitWeight
            );
          }
        }

        return {
          weight: total.weight + itemWeight,
          volume: total.volume + itemVolume,
        };
      },
      { weight: 0, volume: 0 }
    );
  }

  private hasUnit(unitTypes: string[]) {
    return this.data.some((item) => {
      const unit = item.unit?.toUpperCase();
      const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase();

      return (
        unitTypes.includes(unit!) ||
        (unit === "UN" &&
          unitOfUnitWeight &&
          unitTypes.includes(unitOfUnitWeight))
      );
    });
  }

  private formatTotalValues(totalValues: { weight: number; volume: number }) {
    const hasLiters = this.hasUnit(["L"]);
    const hasKilos =
      this.hasUnit(["KG", "G"]) || (this.hasUnit(["UN"]) && !hasLiters);

    if (hasKilos && hasLiters) {
      return `${totalValues.weight.toFixed(3)} KG & ${totalValues.volume.toFixed(3)} L`;
    } else if (hasLiters) {
      return `${totalValues.volume.toFixed(3)} L`;
    }
    return `${totalValues.weight.toFixed(3)} KG`;
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Produtos Comprados");
    this.addSubtitle(
      `Período: ${new Date(this.initialDate).toLocaleDateString(LocaleType.PT_BR)} a ${new Date(
        this.finalDate
      ).toLocaleDateString(LocaleType.PT_BR)}`
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
      `${item.unitWeight === null ? `-` : item.unitWeight} ${item.unitOfUnitWeight === null ? `-` : item.unitOfUnitWeight}`,
      new Date(item.receiptDate).toLocaleDateString(LocaleType.PT_BR),
    ]);

    // Calculate totals using the new method
    const totalValues = this.calculateTotals();
    const formattedTotals = this.formatTotalValues(totalValues);

    // Add main table
    this.addTable(headers, columnWidths, rows);

    this.checkPageBreak(20);
    this.currentY += 5;
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("TOTAL GERAL: ", this.margins.left, this.currentY);

    // Adiciona os valores ao lado, sem negrito
    const labelWidth = this.doc.getTextWidth("TOTAL GERAL: ");
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      formattedTotals,
      this.margins.left + labelWidth,
      this.currentY
    );

    this.currentY += 3;
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    this.addTable([], columnWidths, []);

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

export class InventoryPdfGenerator extends BasePdfGenerator {
  constructor(private data: InventoryReportResponse[]) {
    super({
      orientation: "landscape",
      unit: PdfUnitType.MM,
      format: PdfUnitType.A4,
    });
  }

  private groupByGroup(
    items: InventoryReportResponse[]
  ): Map<string, InventoryReportResponse[]> {
    const groupsMap = new Map<string, InventoryReportResponse[]>();

    items.forEach((item) => {
      const groupName = item.group || "Sem Grupo";
      const groupItems = groupsMap.get(groupName) || [];
      groupItems.push(item);
      groupsMap.set(groupName, groupItems);
    });

    return groupsMap;
  }

  private convertToKg(weight: number, unit: string): number {
    if (!weight) return 0;

    switch (unit?.toUpperCase()) {
      case "G":
        return weight / 1000;
      case "KG":
      default:
        return weight;
    }
  }

  private convertToLiters(volume: number, unit: string): number {
    if (!volume) return 0;

    switch (unit?.toUpperCase()) {
      case "L":
      default:
        return volume;
    }
  }

  private calculateTotals(items: InventoryReportResponse[]) {
    return items.reduce(
      (total, item) => {
        const quantity = item.quantity || 0;
        const unit = item.unit?.toUpperCase();
        const unitWeight = item.unitWeight || 0;
        const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase() || "KG";

        let itemWeight = 0;
        let itemVolume = 0;

        if (unit === "KG" || unit === "G") {
          itemWeight = this.convertToKg(quantity, unit);
        } else if (unit === "L") {
          itemVolume = this.convertToLiters(quantity, unit);
        } else if (unit === "UN") {
          if (unitOfUnitWeight === "L") {
            itemVolume = this.convertToLiters(
              quantity * unitWeight,
              unitOfUnitWeight
            );
          } else {
            itemWeight = this.convertToKg(
              quantity * unitWeight,
              unitOfUnitWeight
            );
          }
        }

        return {
          weight: total.weight + itemWeight,
          volume: total.volume + itemVolume,
          units: total.units + (unit === "UN" && !unitWeight ? quantity : 0),
        };
      },
      { weight: 0, volume: 0, units: 0 }
    );
  }

  private hasUnit(items: InventoryReportResponse[], unitTypes: string[]) {
    return items.some((item) => {
      const unit = item.unit?.toUpperCase();
      const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase();

      return (
        unitTypes.includes(unit!) ||
        (unit === "UN" &&
          unitOfUnitWeight &&
          unitTypes.includes(unitOfUnitWeight))
      );
    });
  }

  private formatTotalValues(
    items: InventoryReportResponse[],
    totalValues: { weight: number; volume: number; units: number }
  ) {
    const parts = [];

    const hasLiters = this.hasUnit(items, ["L"]);
    const hasKilos =
      this.hasUnit(items, ["KG", "G"]) ||
      (this.hasUnit(items, ["UN"]) && !hasLiters);
    const hasUnits =
      this.hasUnit(items, ["UN"]) && !this.hasUnit(items, ["KG", "G", "L"]);

    if (hasKilos) parts.push(`${totalValues.weight.toFixed(3)} KG`);
    if (hasLiters) parts.push(`${totalValues.volume.toFixed(3)} L`);
    if (hasUnits) parts.push(`${totalValues.units} UN`);

    return parts.join(" & ");
  }

  private addHorizontalLine(yPosition: number): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.2);
    this.doc.line(
      this.margins.left,
      yPosition,
      pageWidth - this.margins.right,
      yPosition
    );
  }

  private getStatusText(status: string): string {
    switch (status) {
      case validityStatusType.EXPIRED:
        return "Vencido";
      case validityStatusType.ABOUT_TO_EXPIRE:
        return "Próximo";
      default:
        return "Válido";
    }
  }

  public async generate(): Promise<Uint8Array> {
    this.addTitle("Relatório de Inventário");
    this.addSubtitle(
      `Data de geração: ${new Date().toLocaleDateString(LocaleType.PT_BR)}`
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

    // Agrupar e ordenar grupos
    const groupsMap = this.groupByGroup(this.data);
    const sortedGroups = Array.from(groupsMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    // Variável para acumular os totais gerais
    const grandTotals = { weight: 0, volume: 0, units: 0 };

    for (const [groupName, groupItems] of sortedGroups) {
      this.checkPageBreak(40); // Espaço para cabeçalho + tabela + totais

      // Cabeçalho do grupo
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bolditalic");
      this.doc.text(`Grupo: ${groupName}`, this.margins.left, this.currentY);
      this.currentY += 8;

      // Adicionar tabela
      const rows = groupItems.map((item) => [
        item.id.toString(),
        item.name,
        `${item.quantity} ${item.unit}`,
        `${item.unitWeight === null ? `-` : item.unitWeight} ${item.unitOfUnitWeight === null ? `-` : item.unitOfUnitWeight}`,
        item.lot,
        new Date(item.validityDate).toLocaleDateString(LocaleType.PT_BR),
        item.productType === ProductType.PURCHASED ? "Comprado" : "Doado",
        item.daysUntilExpiry > 0 ? item.daysUntilExpiry.toString() : "Vencido",
        this.getStatusText(item.status),
      ]);

      this.addTable(headers, columnWidths, rows);

      // Calcular e mostrar totais do grupo
      const groupTotals = this.calculateTotals(groupItems);

      // Acumular totais gerais
      grandTotals.weight += groupTotals.weight;
      grandTotals.volume += groupTotals.volume;
      grandTotals.units += groupTotals.units;

      this.currentY += 5;
      this.addHorizontalLine(this.currentY);
      this.currentY += 5;

      const formattedTotals = this.formatTotalValues(groupItems, groupTotals);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("TOTAL DO GRUPO: ", this.margins.left, this.currentY);

      const labelWidth = this.doc.getTextWidth("TOTAL DO GRUPO: ");
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        formattedTotals,
        this.margins.left + labelWidth,
        this.currentY
      );

      this.currentY += 3;
      this.addHorizontalLine(this.currentY);
      this.currentY += 5;

      this.currentY += 15;
    }

    // Adicionar totais gerais
    this.checkPageBreak(20);
    this.currentY += 5;
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

    const grandFormatted = this.formatTotalValues(this.data, grandTotals);

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("TOTAL GERAL: ", this.margins.left, this.currentY);

    const labelWidth = this.doc.getTextWidth("TOTAL GERAL: ");
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      grandFormatted,
      this.margins.left + labelWidth,
      this.currentY
    );

    this.currentY += 3;
    this.addHorizontalLine(this.currentY);
    this.currentY += 5;

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
