import { ProductType, validityStatusType } from "@/types";

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
  unit: string;
  donor: string;
  receiptDate: Date;
};

export type PurchasedReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  receiptDate: Date;
};

export type InventoryReportResponse = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  lot: string;
  validityDate: Date;
  productType: ProductType;
  daysUntilExpiry: number;
  status: validityStatusType;
};

export type DateRangeParams = {
  initialDate: Date;
  finalDate: Date;
};

export type ReportResponse<T> = {
  data?: T[];
  error?: string;
};