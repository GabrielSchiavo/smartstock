import { PdfUnitType } from "@/types/enums/enums";
import { Table } from "@tanstack/react-table";

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

export interface ColumnMetaProps {
  title?: string;
}

export interface GroupedTableProps<TData> {
  table: Table<TData>;
  groupBy?: keyof TData;
  collapsedGroups: Set<string>;
  setCollapsedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export interface GroupedTableTotalValuesProps {
  weight: number;
  volume: number;
}

export interface CopyToClipboardProps {
  textToCopy: string;
  children: React.ReactNode;
  className?: string;
  tooltipContent: string;
}