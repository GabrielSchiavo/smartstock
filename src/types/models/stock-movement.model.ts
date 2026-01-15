import { AdjustmentMovementCategoryType, InputMovementCategoryType, MovementType, OutputMovementCategoryType, UnitType } from "@/types/enums/enums";
import { Product, StockMovement } from "@prisma/client";

export type StockMovementResponse = {
  productId: number;
  quantity: number;
  unit: UnitType;
  movementType: MovementType;
  movementCategory: InputMovementCategoryType | OutputMovementCategoryType | AdjustmentMovementCategoryType | "";
  details: string;
  createdAt: Date;
};

export type StockMovementOperationResponse = {
  success: boolean;
  title: string;
  description?: string;
  product?: Product;
};

export type StockMovementWithProductResponse = StockMovement & {
  product: Product;
};