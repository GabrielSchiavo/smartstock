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
    // Clonar os valores para evitar mutações
    const updateValues = { ...values };
    let hashedPassword: string | undefined;
    let emailUpdated = false;

    // 1. Processar atualização de email
    if (updateValues.email && updateValues.email !== user.email) {
      const emailResponse = await handleEmailUpdate(updateValues.email, dbUser);
      if (!emailResponse.success) {
        return emailResponse;
      }
      emailUpdated = true;
      // Remover email dos valores para não atualizar novamente
      delete updateValues.email;
    }

    // 2. Processar atualização de senha
    if (updateValues.password && updateValues.newPassword) {
      const passwordResponse = await handlePasswordUpdate(
        {
          password: updateValues.password,
          newPassword: updateValues.newPassword,
        },
        dbUser
      );
      
      if (!passwordResponse.success) return passwordResponse;
      
      hashedPassword = passwordResponse.hashedPassword;
      // Remover campos sensíveis
      delete updateValues.password;
      delete updateValues.newPassword;
    }

    // 3. Preparar dados para atualização geral
    const updateData: Partial<z.infer<typeof SettingsSchema>> = { ...updateValues };
    
    // Adicionar senha hasheada se existir
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    // 4. Atualizar outros campos (nome, imagem, etc)
    if (Object.keys(updateData).length > 0) {
      await userRepository.updateSettings(dbUser.id, updateData);
    }

    return {
      success: true,
      title: "Sucesso!",
      description: emailUpdated 
        ? "Configurações atualizadas. Email de verificação enviado."
        : "Configurações atualizadas.",
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
  dbUser: { id: string; name: string | null; email: string }
): Promise<UserSettingsResponse> => {
  // Verificar se o email já está em uso por outro usuário
  const existingUser = await userRepository.findByEmail(newEmail);
  if (existingUser && existingUser.id !== dbUser.id) {
    return {
      success: false,
      title: "Erro!",
      description: "Este email já está em uso.",
    };
  }

  // Primeiro gerar o token (para verificar se é possível antes de atualizar)
  const verificationToken = await generateVerificationToken(newEmail);
  
  try {
    // Tentar enviar o email antes de atualizar no banco
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      dbUser.name || ""
    );
  } catch (error) {
    console.error("Erro ao enviar email de verificação:", error);
    return {
      success: false,
      title: "Erro!",
      description: "O email não foi atualizado. Falha ao enviar email de verificação.",
    };
  }

  // Só atualiza o email no banco se o email for enviado com sucesso
  await userRepository.updateEmail(dbUser.id, newEmail);

  return {
    success: true,
    title: "Sucesso!",
    description: "O email foi atualizado. Email de verificação enviado.",
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