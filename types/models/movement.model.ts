import { AdjustmentMovementCategoryType, InputMovementCategoryType, MovementType, OutputMovementCategoryType, UnitType } from "@/types/enums/enums";

export type MovementResponse = {
  productId: number;
  quantity: number;
  unit: UnitType;
  movementType: MovementType;
  movementCategory: InputMovementCategoryType | OutputMovementCategoryType | AdjustmentMovementCategoryType | "";
  observation: string;
  createdAt: Date;
};
