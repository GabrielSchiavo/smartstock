import { Subgroup } from "@prisma/client"

export type SubgroupResponse<T = Subgroup[]> = {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type SingleSubgroupResponse = SubgroupResponse<Subgroup>

export type SubgroupOperationResponse = Omit<SubgroupResponse, 'data'>

export type CheckSubgroupResponse = {
  isUsed: boolean
  message: string | null
}