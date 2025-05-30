import { ExtendedUser } from "@/next-auth";
import { OptionProps } from "./form.interface";

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