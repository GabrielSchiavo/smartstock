"use server";

import { z } from "zod";
import bcryptjs from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { passwordResetTokenRepository, userRepository } from "@/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  // Validação inicial do token
  if (!token) {
    return { error: "Token ausente!" };
  }

  // Validação dos campos de entrada
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { password } = validatedFields.data;

  try {
    // Verificação do token de redefinição
    const existingToken = await passwordResetTokenRepository.findByToken(token);
    
    if (!existingToken) {
      return { error: "Token inválido!" };
    }

    // Verificação de expiração do token
    const hasExpired = new Date(existingToken.expires) < new Date();
    
    if (hasExpired) {
      return { error: "Token expirado!" };
    }

    // Verificação do usuário associado
    const existingUser = await userRepository.findByEmail(existingToken.email);
    
    if (!existingUser) {
      return { error: "Usuário não encontrado!" };
    }

    // Processamento da nova senha
    const hashedPassword = await bcryptjs.hash(password, 10);
    await userRepository.updatePassword(existingUser.id, hashedPassword);

    // Limpeza do token utilizado
    await passwordResetTokenRepository.delete(existingToken.id);

    return { success: "Senha alterada com sucesso!" };
  } catch (error) {
    console.error("Erro durante a redefinição de senha:", error);
    return { error: "Ocorreu um erro ao alterar a senha. Por favor, tente novamente." };
  }
};