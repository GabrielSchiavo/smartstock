import { BaseUnitType } from "@/types";
import { MasterProduct } from "@prisma/client";

export type MasterProductResponse = {
  name: string;
  baseUnit: BaseUnitType;
  category: string;
  group: string;
  subgroup?: string | null;
  
};

export interface MasterProductUpdateResponse extends MasterProductResponse {
  updatedAt: Date;
}

export type MasterProductOperationResponse = {
  success: boolean;
  title: string;
  description?: string;
  masterProduct?: MasterProduct;
  isUsed?: boolean
};