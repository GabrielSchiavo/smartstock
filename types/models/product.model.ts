import { MasterProduct, Product } from "@prisma/client";
import { ProductType, UnitType } from "@/types";

export type ProductResponse = {
  masterProductId: number;
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number | null;
  unitOfUnitWeight?: UnitType | null;
  lot: string;
  validityDate: Date;
  supplier?: string | null;
  receiptDate: Date;
  receiver: string;
  category: string;
  group: string;
  subgroup?: string | null;
  productType: ProductType;
};

// Tipo estendido para produto com informações do produto mestre
export type ProductWithMasterProductResponse = Product & {
  masterProduct: MasterProduct;
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