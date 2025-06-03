import type { Donor } from '@prisma/client'

export type DonorResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Donor[]
}

export type SingleDonorResponse = {
  success: boolean
  title?: string
  description?: string
  data?: Donor
}

export type CheckDonorResponse = {
  success: boolean
  title?: string
  description?: string
  isUsed: boolean
}

export type DonorCountResponse = {
  success: boolean
  title?: string
  description?: string
  count?: number
}