import { ProductType, UnitType, ValidityStatusType } from "@/types";

export type ReportResponse<T> = {
  data?: T[];
  success: boolean;
  title: string;
  description?: string;
};

export type ValidityReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
  lot: string;
  validityDate: Date;
  daysUntilExpiry: number;
  status: ValidityStatusType;
};

export type DonationsReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
  supplier: string;
  receiptDate: Date;
};

export type PurchasedReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
  receiptDate: Date;
};

export type InventoryReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
  lot: string;
  validityDate: Date;
  productType: ProductType;
  daysUntilExpiry: number;
  status: ValidityStatusType;
  group: string;
};

export type DateRangeParams = {
  initialDate: Date;
  finalDate: Date;
};
