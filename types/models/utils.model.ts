import { OptionProps } from "../interfaces/form.interface";

export type ResetPasswordResponse = {
  success?: string;
  error?: string;
};

export type ThemeContextParams = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string | null | undefined;
  error?: string;
};

export type UsageCheckResponse = {
  isUsed: boolean;
  message?: string | null | undefined;
};

export type ComboboxApiParams<T = OptionProps> = {
  search: (query: string) => Promise<ApiResponse<T[]>>;
  getAll: () => Promise<ApiResponse<T[]>>;
  create: (name: string) => Promise<ApiResponse<T>>;
  delete: (id: string) => Promise<ApiResponse<T[]>>;
  checkUsage: (name: string) => Promise<UsageCheckResponse>;
};