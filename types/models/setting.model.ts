export type UserSettingsResponse = {
  success?: string;
  error?: string;
};

export type UserSettingsUpdateResponse = {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
};

export type PasswordSettingsParams = {
  password: string;
  newPassword: string;
};