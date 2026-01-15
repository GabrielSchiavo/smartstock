import type { Category } from '@prisma/client'

export type CategoryResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Category[]
}

export type SingleCategoryResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Category
}

export type CheckCategoryResponse = {
  success: boolean
  title?: string
  description?: string
  isUsed: boolean
}

export type CategoryCountResponse = {
  success: boolean
  title?: string
  description?: string
  count?: number
}