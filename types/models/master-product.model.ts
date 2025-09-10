import { BaseUnitType } from "@/types";
import { Category, Group, MasterProduct, Subgroup } from "@prisma/client";

export type MasterProductResponse = {
  name: string;
  baseUnit: BaseUnitType;
  categoryId: string;
  groupId: string;
  subgroupId?: string | null;
  
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

export type MasterProductWithCategoryGroupSubgroupResponse = MasterProduct & {
  category: Category;
  group: Group;
  subgroup?: Subgroup | null;
};