import {
  CalculableTotalItemProps,
  PdfConfigProps,
  PdfUnitType,
  ValidityStatusType,
} from "@/types";
import jsPDF from "jspdf";
import { formatDateOnlyToLocale } from "@/utils/date-utils";
import { calculateTotals, createTotalSummary } from "@/utils/calculate-totals";

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
      unit: (config.unit || PdfUnitType.MM) as "pt" | "mm" | "cm" | "in" | "em" | "px" | "ex" | "pc",
      format: (config.format || PdfUnitType.A4) as string | number[],
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
    formatDateOnlyToLocale(new Date(dateString));

  protected getStatusText = (status: string): string => {
    switch (status) {
      case ValidityStatusType.EXPIRED:
        return "Vencido";
      case ValidityStatusType.EXPIRING:
        return "Próximo";
      default:
        return "Válido";
    }
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

  protected calculateTotals(items: Array<CalculableTotalItemProps>) {
    return calculateTotals(items);
  }

  protected formatTotalValues(
    totalValues: { weight: number; volume: number; units: number }
  ) {
    return createTotalSummary(totalValues);
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

    // "SmartStock" text centered at the top
    this.doc.text("SmartStock", pageWidth / 2, topFooterY, { align: "center" });
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
