import type { Donor } from '@prisma/client'

export type DonorResponse = {
  success: boolean
  data?: Donor[]
  message?: string
  error?: string
}

export type SingleDonorResponse = {
  success: boolean
  data?: Donor
  message?: string
  error?: string
}

export type CheckDonorResponse = {
  isUsed: boolean
  message: string | null
}

export type DonorCountResponse = {
  success: boolean
  count?: number
  error?: string
}