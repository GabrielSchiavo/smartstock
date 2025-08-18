import { UnitType } from "@/types";
import { MasterItem } from "@prisma/client";

export type MasterItemResponse = {
  name: string;
  baseUnit: UnitType;
  category: string;
  group: string;
  subgroup?: string | null;
};

export interface MasterItemUpdateResponse extends MasterItemResponse {
  updatedAt: Date;
}

export type MasterItemOperationResponse = {
  success: boolean;
  title: string;
  description?: string;
  masterItem?: MasterItem;
};