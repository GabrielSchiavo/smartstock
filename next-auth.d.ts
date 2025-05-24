import { type DefaultSession } from "next-auth";
import { UserType } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserType;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
