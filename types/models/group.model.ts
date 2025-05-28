// types/group.ts
import type { Group } from '@prisma/client'

export type GroupResponse = {
  success: boolean
  data?: Group[]
  message?: string
  error?: string
}

export type SingleGroupResponse = {
  success: boolean
  data?: Group
  message?: string
  error?: string
}

export type CheckGroupResponse = {
  isUsed: boolean
  message: string | null
}