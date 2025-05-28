"use server";

import { userRepository } from "@/db";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/send-mail";
import { SettingsSchema } from "@/schemas";
import { PasswordSettingsParams, UserSettingsResponse, UserSettingsUpdateResponse } from "@/types";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const updateUserSettings = async (
  values: z.infer<typeof SettingsSchema>
): Promise<UserSettingsResponse> => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Não autorizado!" };
  }

  const dbUser = await userRepository.findById(user.id);
  if (!dbUser) {
    return { error: "Não autorizado!" };
  }

  try {
    // Atualização de email
    if (values.email && values.email !== user.email) {
      return await handleEmailUpdate(values.email, dbUser);
    }

    // Atualização de senha
    if (values.password && values.newPassword) {
      const passwordResponse = await handlePasswordUpdate({
        password: values.password,
        newPassword: values.newPassword
      }, dbUser);
      if (passwordResponse.error) return passwordResponse;
      
      // Atualiza o objeto values com a nova senha hashada
      values.password = passwordResponse.hashedPassword;
      values.newPassword = undefined;
    }

    // Atualização geral das configurações
    const updateData: UserSettingsUpdateResponse = { ...values };
    await userRepository.updateSettings(dbUser.id, updateData);
    
    return { success: "Configurações atualizadas com sucesso!" };

  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return { error: "Ocorreu um erro ao atualizar as configurações" };
  }
};

const handleEmailUpdate = async (
  newEmail: string,
  dbUser: { id: string; name: string | null }
): Promise<UserSettingsResponse> => {
  const existingUser = await userRepository.findByEmail(newEmail);
  if (existingUser && existingUser.id !== dbUser.id) {
    return { error: "Email já está em uso!" };
  }

  await userRepository.updateEmail(dbUser.id, newEmail);

  const verificationToken = await generateVerificationToken(newEmail);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
    dbUser.name || ""
  );

  return { success: "Email de verificação enviado!" };
};

const handlePasswordUpdate = async (
  { password, newPassword }: PasswordSettingsParams,
  dbUser: { password?: string | null }
): Promise<{ error?: string; hashedPassword?: string }> => {
  if (!dbUser.password) {
    return { error: "Operação não permitida!" };
  }

  const isPasswordValid = await bcrypt.compare(password, dbUser.password);
  if (!isPasswordValid) {
    return { error: "Senha atual inválida!" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return { hashedPassword };
};