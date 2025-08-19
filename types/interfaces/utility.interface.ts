import { PdfUnitType, UnitType } from "@/types/enums/enums";
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

export interface CopyToClipboardProps {
  textToCopy: string;
  children: React.ReactNode;
  className?: string;
  tooltipContent: string;
}


// unit-conversion.ts
export interface ConvertOptionsProps {
  unitWeight?: number;
  unitWeightUnit?: UnitType;
  decimals?: number;
};
// calculate-totals.ts
export interface CalculableTotalItemProps {
  quantity?: number;
  unit?: UnitType;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
}
export interface TotalValuesProps {
  weight: number;
  volume: number;
  units: number;
}
export interface TotalValuesWithUnitsProps {
  weight: {
    value: number;
    unit: 'KG';
    formatted: string;
  };
  volume: {
    value: number;
    unit: 'L';
    formatted: string;
  };
  units: {
    value: number;
    unit: 'UN';
    formatted: string;
  };
}