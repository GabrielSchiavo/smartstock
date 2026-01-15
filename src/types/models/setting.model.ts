export type UserSettingsResponse = {
  success: boolean;
  title: string;
  description?: string;
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

export type PasswordUpdateResponse = {
  success: boolean;
  title: string;
  description?: string;
  hashedPassword?: string;
};