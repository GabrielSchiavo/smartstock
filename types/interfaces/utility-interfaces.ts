import { PdfUnitType } from "../enums";

export interface PdfConfigProps {
  orientation?: "portrait" | "landscape";
  unit?: PdfUnitType;
  format?: string | number[];
  margins?: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

export interface EmailTemplateProps {
  userName?: string;
  url?: string;
}
