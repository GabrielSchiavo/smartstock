import { Subgroup } from "@prisma/client";

export type SubgroupResponse<T = Subgroup[]> = {
  success: boolean;
  title?: string;
  description?: string;
  data?: T;
};

export type SingleSubgroupResponse = SubgroupResponse<Subgroup>;

export type SubgroupOperationResponse = Omit<SubgroupResponse, "data">;

export type CheckSubgroupResponse = {
  isUsed: boolean;
  success: boolean;
  title?: string;
  description?: string;
};
