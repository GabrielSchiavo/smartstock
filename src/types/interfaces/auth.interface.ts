import { UserType } from "@/types";

export interface HomeLoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export interface LogoutButtonProps {
  children?: React.ReactNode;
}

export interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserType[];
  isPage: boolean;
}
