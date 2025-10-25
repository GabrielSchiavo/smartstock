import { MasterProductWithCategoryGroupSubgroupResponse, OptionProps, ProductWithMasterProductResponse } from "@/types";
import { ToastType } from "@/types";

export interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export interface BackButtonProps {
  href: string;
  label: string;
}

export interface HeaderProps {
  label: string;
}

export interface MessageProps {
  message?: string;
  className?: string;
}

export interface BaseDynamicComboboxProps {
  value: string;
  placeholder?: string;
  displayValue: string;
  disabled?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string | null) => void;
  options: OptionProps[];
  isPending: boolean;
  allowCreate: boolean;
  allowDelete: boolean;
  handleCreateNew: () => void;
  handleSelect: (option: OptionProps) => void;
  handleDelete: (id: string) => void;
  className?: string;
  resourceName: string;
}

export interface ToastProps {
  title: string;
  description?: string;
  type: ToastType;
}

export interface LogoWithTextProps {
  imageSize?: string;
  textSize?: string;
  containerClasses?: string;
  containerImageClasses?: string;
  containerTextClasses?: string;
}

export interface SelectorProductProps {
  products: ProductWithMasterProductResponse[];
  onSelect: (product: ProductWithMasterProductResponse) => void;
  selectedId?: string;
  disabled?: boolean;
  isLoading: boolean;
}

export interface SelectorMasterProductProps {
  masterProducts: MasterProductWithCategoryGroupSubgroupResponse[];
  onSelect: (masterProduct: MasterProductWithCategoryGroupSubgroupResponse) => void;
  selectedId?: string;
  disabled?: boolean;
  isLoading: boolean;
}