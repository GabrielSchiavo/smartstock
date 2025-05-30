export type ResetPasswordResponse = {
  success?: string;
  error?: string;
};

export type ThemeContextParams = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
}