import { OptionProps } from "@/types";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export type ResetPasswordResponse = {
  success?: string;
  error?: string;
};

export type ThemeContextParams = {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
};

export type ApiResponse<T> = {
  success: boolean;
  title?: string;
  description?: string;
  data?: T;
};

export type UsageCheckResponse = {
  isUsed: boolean;
  message?: string | null | undefined;
};

export interface FetchParams {
  signal?: AbortSignal;
}

export type ComboboxApiParams<T = OptionProps> = {
  search: (query: string, params?: FetchParams) => Promise<ApiResponse<T[]>>;
  getAll: (params?: FetchParams) => Promise<ApiResponse<T[]>>;
  create: (name: string) => Promise<ApiResponse<T>>;
  delete: (id: string) => Promise<ApiResponse<T[]>>;
  checkUsage: (name: string) => Promise<UsageCheckResponse>;
};

export type SmtpTransporter = Transporter<SMTPTransport.SentMessageInfo> & {
  transporter: SMTPTransport;
};

export type DeleteActionResponse = {
  success: boolean;
  title: string;
  description: string;
};