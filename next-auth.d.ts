import { type DefaultSession } from "next-auth";
import { UserType } from "@/types";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserType;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
