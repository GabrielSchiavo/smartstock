import { Receiver } from "@prisma/client"

export type ReceiverResponse<T = Receiver[]> = {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type SingleReceiverResponse = ReceiverResponse<Receiver>

export type ReceiverOperationResponse = Omit<ReceiverResponse, 'data'>

export type CheckReceiverResponse = {
  isUsed: boolean
  message: string | null
}