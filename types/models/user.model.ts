import { User } from "@prisma/client";
import { UserType } from "@/types";

export type UserResponse = {
  name: string;
  email: string;
  password?: string;
  role: UserType;
};

export type UserOperationResponse = {
  success?: string;
  error?: string;
  user?: User;
};