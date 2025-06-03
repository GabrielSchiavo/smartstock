import { Product } from "@prisma/client";
import { ProductType, UnitType } from "@/types";

export type ProductResponse = {
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number;
  unitOfUnitWeight?: UnitType;
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
  success: boolean;
  title: string;
  description?: string;
  product?: Product;
};