import { ExtendedUser } from "@/next-auth";

export interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export interface BackButtonProps {
  href: string;
  label: string;
}

export interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export interface HeaderProps {
  label: string;
}

export interface MessageProps {
  message?: string;
  className?: string;
}