import { PdfUnitType, BaseUnitType, UnitType, ValidityStatusType } from "@/types/enums/enums";
import { MasterProduct } from "@prisma/client";

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
    unit: BaseUnitType.KG;
    formatted: string;
  };
  volume: {
    value: number;
    unit: BaseUnitType.L;
    formatted: string;
  };
  units: {
    value: number;
    unit: BaseUnitType.UN;
    formatted: string;
  };
}

export interface SelectorMasterProductProps {
  masterProducts: MasterProduct[];
  onSelect: (masterProduct: MasterProduct) => void;
  selectedId?: string;
  disabled?: boolean;
  isLoading: boolean;
}

// check-expiry-status.ts
export interface DateValidationOptions {
  /** Se deve considerar apenas a data (ignorando horas) */
  dateOnly?: boolean;
  /** Número de dias para considerar como "expirando" */
  expiringThreshold?: number;
  /** Função personalizada para formatação da data */
  formatDate?: (date: Date) => string;
}
export interface DateValidationResult {
  daysUntilExpiry: number;
  status: ValidityStatusType;
  formattedDate?: string;
  isExpired: boolean;
  isExpiring: boolean;
  isValid: boolean;
}