import { MovementCategoryType, MovementType, UnitType } from "@/types/enums/enums";

export type MovementResponse = {
  productId: number;
  quantity: number;
  unit: UnitType;
  movementType: MovementType;
  movementCategory: MovementCategoryType;
  observation: string;
  createdAt: Date;
};
