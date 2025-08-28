import { AdjustmentMovementCategoryType, InputMovementCategoryType, MovementType, OutputMovementCategoryType, UnitType } from "@/types/enums/enums";
import { Product } from "@prisma/client";

export type MovementResponse = {
  productId: number;
  quantity: number;
  unit: UnitType;
  movementType: MovementType;
  movementCategory: InputMovementCategoryType | OutputMovementCategoryType | AdjustmentMovementCategoryType | "";
  details: string;
  createdAt: Date;
};

export type MovementOperationResponse = {
  success: boolean;
  title: string;
  description?: string;
  product?: Product;
};