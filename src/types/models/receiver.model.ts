import { Receiver } from "@prisma/client";

export type ReceiverResponse<T = Receiver[]> = {
  success: boolean;
  title?: string;
  description?: string;
  data?: T;
};

export type SingleReceiverResponse = ReceiverResponse<Receiver>;

export type ReceiverOperationResponse = Omit<ReceiverResponse, "data">;

export type CheckReceiverResponse = {
  isUsed: boolean;
  success: boolean;
  title?: string;
  description?: string;
};
