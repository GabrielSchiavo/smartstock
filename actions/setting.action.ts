"use server";

import { userRepository } from "@/db";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/send-mail";
import { SettingsSchema } from "@/schemas";
import {
  PasswordSettingsParams,
  PasswordUpdateResponse,
  UserSettingsResponse,
  UserSettingsUpdateResponse,
} from "@/types";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const updateUserSettings = async (
  values: z.infer<typeof SettingsSchema>
): Promise<UserSettingsResponse> => {
  const user = await currentUser();
  if (!user || !user.id) {
    return {
      success: false,
      title: "Erro!",
      description: "Não autorizado.",
    };
  }

  const dbUser = await userRepository.findById(user.id);
  if (!dbUser) {
    return {
      success: false,
      title: "Erro!",
      description: "Não autorizado.",
    };
  }

  try {
    // Atualização de email
    if (values.email && values.email !== user.email) {
      return await handleEmailUpdate(values.email, dbUser);
    }

    // Atualização de senha
    if (values.password && values.newPassword) {
      const passwordResponse = await handlePasswordUpdate(
        {
          password: values.password,
          newPassword: values.newPassword,
        },
        dbUser
      );
      if (passwordResponse.success === false) return passwordResponse;

      // Atualiza o objeto values com a nova senha hashada
      values.password = passwordResponse.hashedPassword;
      values.newPassword = undefined;
    }

    // Atualização geral das configurações
    const updateData: UserSettingsUpdateResponse = { ...values };
    await userRepository.updateSettings(dbUser.id, updateData);

    return {
      success: true,
      title: "Sucesso!",
      description: "Configurações atualizadas com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível atualizar as configurações",
    };
  }
};

const handleEmailUpdate = async (
  newEmail: string,
  dbUser: { id: string; name: string | null }
): Promise<UserSettingsResponse> => {
  const existingUser = await userRepository.findByEmail(newEmail);
  if (existingUser && existingUser.id !== dbUser.id) {
    return {
      success: false,
      title: "Erro!",
      description: "Este email já está em uso.",
    };
  }

  await userRepository.updateEmail(dbUser.id, newEmail);

  const verificationToken = await generateVerificationToken(newEmail);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
    dbUser.name || ""
  );

  return {
    success: true,
    title: "Sucesso!",
    description: "Email de verificação enviado.",
  };
};

const handlePasswordUpdate = async (
  { password, newPassword }: PasswordSettingsParams,
  dbUser: { password?: string | null }
): Promise<PasswordUpdateResponse> => {
  if (!dbUser.password) {
    return {
      success: false,
      title: "Erro!",
      description: "Operação não permitida.",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, dbUser.password);
  if (!isPasswordValid) {
    return {
      success: false,
      title: "Erro!",
      description: "Senha atual inválida!",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return {
    success: true,
    title: "Sucesso!",
    description: "Senha atualizada com sucesso.",
    hashedPassword,
  };
};
