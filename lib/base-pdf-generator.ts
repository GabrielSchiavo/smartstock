import jsPDF from "jspdf";

export interface PdfConfig {
  orientation?: "portrait" | "landscape";
  unit?: "pt" | "mm" | "cm" | "in";
  format?: string | number[];
  margins?: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

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

  constructor(config: PdfConfig = {}) {
    this.doc = new jsPDF({
      orientation: config.orientation || "portrait",
      unit: config.unit || "mm",
      format: config.format || "a4",
    });

    this.margins = config.margins || {
      top: 25,
      left: 20,
      right: 20,
      bottom: 25,
    };

    this.currentY = this.margins.top;
    this.pageCount = 1;
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
        : "a4",
      this.doc.internal.pageSize.getWidth() >
        this.doc.internal.pageSize.getHeight()
        ? "landscape"
        : "portrait"
    );
    this.currentY = this.margins.top;

    // Reimprime o cabeçalho em novas páginas
    if (this.currentHeaders.length > 0) {
      this.addTableHeader();
    }

    // Redefine explicitamente a formatação para as linhas
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0); // Preto
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
