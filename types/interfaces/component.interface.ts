import { ExtendedUser } from "@/next-auth";
import { OptionProps } from "@/types";
import { AlertType, Product } from "@prisma/client";
import { ToastType } from "@/types";

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

export interface BaseComboboxProps {
  value: string;
  placeholder?: string;
  displayValue: string;
  disabled?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  options: OptionProps[];
  isPending: boolean;
  allowCreate: boolean;
  allowDelete: boolean;
  handleCreateNew: () => void;
  handleSelect: (option: OptionProps) => void;
  handleDelete: (id: string, name: string) => void;
  className?: string;
  resourceName: string;
}

export interface BasicAlertProps {
  id: string;
  type: AlertType;
  isRead: boolean;
  createdAt: Date;
  product: Product;
}

export interface AlertProps {
  alert: BasicAlertProps;
  key?: string;
}

export interface ToastProps {
  title: string;
  description?: string;
  type: ToastType;
}