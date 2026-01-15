// types/group.ts
import type { Group } from '@prisma/client'

export type GroupResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Group[]
}

export type SingleGroupResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Group
}

export type CheckGroupResponse = {
  success: boolean
  title?: string
  description?: string
  isUsed: boolean
}