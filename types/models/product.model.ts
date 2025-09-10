import { Product, Receiver, Supplier } from "@prisma/client";
import { AdjustmentMovementCategoryType, BaseUnitType, InputMovementCategoryType, MasterProductWithCategoryGroupSubgroupResponse, OutputMovementCategoryType, ProductType, UnitType } from "@/types";

export type ProductResponse = {
  masterProductId: number;
  name: string;
  quantity: number;
  unit: UnitType;
  unitWeight?: number | null;
  unitOfUnitWeight?: UnitType | null;
  lot: string;
  validityDate: Date;
  supplierId?: string | null;
  receiptDate: Date;
  receiverId: string;
  category: string;
  group: string;
  subgroup?: string | null;
  baseUnit: BaseUnitType;
  productType: ProductType;
  movementCategory: InputMovementCategoryType | OutputMovementCategoryType | AdjustmentMovementCategoryType | "";
};

// Tipo estendido para produto com informações do produto mestre
export type ProductWithMasterProductResponse = Product & {
  receiver: Receiver;
  supplier?: Supplier | null;
  masterProduct: MasterProductWithCategoryGroupSubgroupResponse;
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