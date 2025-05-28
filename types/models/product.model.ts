import { Product } from "@prisma/client";
import { ProductType, UnitType } from "@/types";

export type ProductResponse = {
  name: string;
  quantity: number;
  unit: UnitType;
  lot: string;
  validityDate: Date;
  donor?: string;
  receiptDate: Date;
  receiver: string;
  group: string;
  subgroup?: string;
  productType: ProductType;
};

export interface ProductUpdateResponse extends ProductResponse {
  updatedAt: Date;
}

export type ProductOperationResponse = {
  success?: string;
  error?: string;
  product?: Product;
};

export type ProductCountResponse = {
  success: boolean
  count?: number
  error?: string
}