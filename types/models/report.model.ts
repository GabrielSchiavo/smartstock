import { ProductType, UnitType, validityStatusType } from "@/types";

export type ValidityReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  lot: string;
  validityDate: Date;
  daysUntilExpiry: number;
  status: validityStatusType;
};

export type DonationsReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
  donor: string;
  receiptDate: Date;
};

export type PurchasedReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: UnitType;
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
  status: validityStatusType;
  group: string;
};

export type DateRangeParams = {
  initialDate: Date;
  finalDate: Date;
};

export type ReportResponse<T> = {
  data?: T[];
  error?: string;
};