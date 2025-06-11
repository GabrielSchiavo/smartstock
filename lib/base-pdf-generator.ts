import { LocaleType, PdfConfigProps, PdfUnitType, UnitType, validityStatusType } from "@/types";
import jsPDF from "jspdf";
import { formatDateToLocale } from "@/lib/date-utils";

export abstract class BasePdfGenerator {
  protected doc: jsPDF;
  protected currentY: number;
  protected readonly margins: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };

  protected currentHeaders: string[] = [];
  protected currentColumnWidths: number[] = [];
  protected headerYPosition: number | null = null;
  protected pageCount: number = 1;

  constructor(config: PdfConfigProps = {}) {
    this.doc = new jsPDF({
      orientation: config.orientation || "portrait",
      unit: config.unit || PdfUnitType.MM,
      format: config.format || PdfUnitType.A4,
    });

    this.margins = config.margins || {
      top: 25,
      left: 5,
      right: 5,
      bottom: 25,
    };

    this.currentY = this.margins.top;
    this.pageCount = 1;
  }

  protected static readonly PDF_CONFIG = {
    orientation: "landscape" as const,
    unit: PdfUnitType.MM,
    format: PdfUnitType.A4,
  };

  protected COMMON_STYLES = {
    // titleFont: { size: 16, style: "bold" as const },
    // subtitleFont: { size: 12, style: "normal" as const },
    sectionHeaderFont: { size: 12, style: "bolditalic" as const },
    totalLabelFont: { size: 10, style: "bold" as const },
    totalValueFont: { size: 10, style: "italic" as const },
    grandTotalFont: { size: 12, style: "bold" as const },
    horizontalLine: { color: [200, 200, 200], width: 0.2 },
  };

  // Helper functions
  protected formatDate = (dateString: string) =>
    formatDateToLocale(new Date(dateString));

  protected getStatusText = (status: string): string => {
    switch (status) {
      case validityStatusType.EXPIRED:
        return "Vencido";
      case validityStatusType.EXPIRING:
        return "Próximo";
      default:
        return "Válido";
    }
  };

  protected convertToKg = (weight: number, unit: string): number => {
    if (!weight) return 0;
    return unit?.toUpperCase() === UnitType.G ? weight / 1000 : weight;
  };

  protected convertToLiters = (volume: number): number => {
    return volume || 0;
  };

  protected addHorizontalLine(yPosition: number): void {
      const pageWidth = this.doc.internal.pageSize.getWidth();
      this.doc.setDrawColor(
        this.COMMON_STYLES.horizontalLine.color[0],
        this.COMMON_STYLES.horizontalLine.color[1],
        this.COMMON_STYLES.horizontalLine.color[2]
      );
      this.doc.setLineWidth(this.COMMON_STYLES.horizontalLine.width);
      this.doc.line(
        this.margins.left,
        yPosition,
        pageWidth - this.margins.right,
        yPosition
      );
    }
  
    protected calculateItemMetrics(item: {
      quantity?: number;
      unit?: string;
      unitWeight?: number;
      unitOfUnitWeight?: string;
    }) {
      const quantity = item.quantity || 0;
      const unit = item.unit?.toUpperCase();
      const unitWeight = item.unitWeight || 0;
      const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase() || UnitType.KG;
  
      let weight = 0;
      let volume = 0;
      let units = 0;

      if (unit === UnitType.KG || unit === UnitType.G) {
        weight = this.convertToKg(quantity, unit);
      } else if (unit === UnitType.L) {
        volume = this.convertToLiters(quantity);
      } else if (unit === UnitType.UN) {
        if (unitOfUnitWeight === UnitType.L) {
          volume = this.convertToLiters(quantity * unitWeight);
        } else {
          weight = this.convertToKg(quantity * unitWeight, unitOfUnitWeight);
        }
        if (!unitWeight) units = quantity;
      }
  
      return { weight, volume, units };
    }
  
    protected calculateTotals(
      items: Array<{
        quantity?: number;
        unit?: string;
        unitWeight?: number;
        unitOfUnitWeight?: string;
      }>
    ) {
      return items.reduce(
        (total, item) => {
          const metrics = this.calculateItemMetrics(item);
          return {
            weight: total.weight + metrics.weight,
            volume: total.volume + metrics.volume,
            units: total.units + metrics.units,
          };
        },
        { weight: 0, volume: 0, units: 0 }
      );
    }
  
    protected hasUnit(
      items: Array<{ unit?: string; unitOfUnitWeight?: string }>,
      unitTypes: string[]
    ) {
      return items.some((item) => {
        const unit = item.unit?.toUpperCase();
        const unitOfUnitWeight = item.unitOfUnitWeight?.toUpperCase();
  
        return (
          unitTypes.includes(unit!) ||
          (unit === UnitType.UN &&
            unitOfUnitWeight &&
            unitTypes.includes(unitOfUnitWeight))
        );
      });
    }
  
    protected formatTotalValues(
      items: Array<{ unit?: string; unitOfUnitWeight?: string }>,
      totalValues: { weight: number; volume: number; units: number }
    ) {
      const parts = [];
  
      const hasLiters = this.hasUnit(items, [UnitType.L]);
      const hasKilos =
        this.hasUnit(items, [UnitType.KG, UnitType.G]) ||
        (this.hasUnit(items, [UnitType.UN]) && !hasLiters);
      const hasUnits =
        this.hasUnit(items, [UnitType.UN]) && !this.hasUnit(items, [UnitType.KG, UnitType.G, UnitType.L]);

      if (hasKilos)
        parts.push(
          `${Number(totalValues.weight.toFixed(3)).toLocaleString(
            LocaleType.PT_BR,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3,
            }
          )} ${UnitType.G}`
        );
      if (hasLiters)
        parts.push(
          `${Number(totalValues.volume.toFixed(3)).toLocaleString(
            LocaleType.PT_BR,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3,
            }
          )} ${UnitType.L}`
        );
      if (hasUnits) parts.push(`${totalValues.units} ${UnitType.UN}`);

      return parts.join(" & ");
    }
  
    protected addTotalSection(
      label: string,
      value: string,
      isGrandTotal = false
    ) {
      const font = isGrandTotal
        ? this.COMMON_STYLES.grandTotalFont
        : this.COMMON_STYLES.totalLabelFont;
  
      this.doc.setFontSize(font.size);
      this.doc.setFont("helvetica", font.style);
      this.doc.text(`${label}: `, this.margins.left, this.currentY);
  
      const labelWidth = this.doc.getTextWidth(`${label}: `);
      this.doc.setFont(
        "helvetica",
        isGrandTotal ? "italic" : this.COMMON_STYLES.totalValueFont.style
      );
      this.doc.text(value, this.margins.left + labelWidth, this.currentY);
  
      this.currentY += 5;
    }

  protected addTopFooter(): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const topFooterY = 10; // Position above the top margin

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100); // Gray

    // "Smartstock" text centered at the top
    this.doc.text("Smartstock", pageWidth / 2, topFooterY, { align: "center" });
  }

  protected addFooter(): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const footerY = this.doc.internal.pageSize.getHeight() - 10;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);

    this.doc.text(`Página ${this.pageCount}`, pageWidth / 2, footerY, {
      align: "center",
    });

    this.pageCount++;
  }

  protected addTitle(title: string, fontSize = 18): void {
    this.addTopFooter();
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, this.margins.left, this.currentY);
    this.currentY += 10;
  }

  protected addSubtitle(subtitle: string, fontSize = 12): void {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(fontSize);
    this.doc.text(subtitle, this.margins.left, this.currentY);
    this.currentY += 10;
  }

  protected checkPageBreak(spaceNeeded: number): void {
    const pageHeight = this.doc.internal.pageSize.getHeight();
    if (this.currentY + spaceNeeded > pageHeight - this.margins.bottom) {
      this.addNewPage();
    }
  }

  protected addNewPage(): void {
    this.addFooter();

    this.doc.addPage(
      typeof this.doc.internal.pageSize.getWidth() === "number"
        ? [
            this.doc.internal.pageSize.getWidth(),
            this.doc.internal.pageSize.getHeight(),
          ]
        : PdfUnitType.A4,
      this.doc.internal.pageSize.getWidth() >
        this.doc.internal.pageSize.getHeight()
        ? "landscape"
        : "portrait"
    );
    this.currentY = this.margins.top;

    this.addTopFooter();

    // Reimprime o cabeçalho em novas páginas
    // if (this.currentHeaders.length > 0) {
    //   this.addTableHeader();
    // }

    // Redefine explicitamente a formatação para as linhas
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
  }

  protected addTableHeader(): void {
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);

    this.currentHeaders.forEach((header, i) => {
      const columnStart =
        this.margins.left +
        this.currentColumnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      const columnCenter = columnStart + this.currentColumnWidths[i] / 2;

      // Cabeçalho centralizado
      this.doc.text(header, columnCenter, this.currentY, { align: "center" });
    });

    this.headerYPosition = this.currentY;
    this.currentY += 10;
  }

  protected addTable(
    headers: string[],
    columnWidths: number[],
    rows: string[][]
  ): void {
    // Armazena cabeçalhos e larguras para reuso
    this.currentHeaders = headers;
    this.currentColumnWidths = columnWidths;

    // Adiciona cabeçalho na primeira página
    this.addTableHeader();

    // Adiciona linhas
    this.doc.setFont("helvetica", "normal");
    rows.forEach((row) => {
      this.checkPageBreak(10); // Verifica se precisa de nova página

      row.forEach((text, i) => {
        const columnStart =
          this.margins.left +
          columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        const columnCenter = columnStart + columnWidths[i] / 2;

        // Texto centralizado na coluna
        this.doc.text(text, columnCenter, this.currentY, { align: "center" });
      });
      this.currentY += 10;
    });
  }

  public abstract generate(): Promise<Uint8Array>;
}
