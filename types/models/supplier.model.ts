import type { Supplier } from '@prisma/client'

export type SupplierResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Supplier[]
}

export type SingleSupplierResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Supplier
}

export type CheckSupplierResponse = {
  success: boolean
  title?: string
  description?: string
  isUsed: boolean
}

export type SupplierCountResponse = {
  success: boolean
  title?: string
  description?: string
  count?: number
}