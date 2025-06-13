"use server";

import { userRepository } from "@/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/send-mail";
import { ResetSchema } from "@/schemas";
import { z } from "zod";
import { ResetPasswordResponse } from "@/types";

export const resetPassword = async (
  values: z.infer<typeof ResetSchema>
): Promise<ResetPasswordResponse> => {
  // Validação dos campos de entrada
  const validationResult = ResetSchema.safeParse(values);
  if (!validationResult.success) {
    return { error: "Email inválido!" };
  }

  const { email } = validationResult.data;

  try {
    // Verifica se o usuário existe
    const existingUser = await userRepository.findByEmail(email);
    if (!existingUser) {
      return { error: "Email não encontrado!" };
    }

    // Gera o token de redefinição
    const passwordResetToken = await generatePasswordResetToken(email);

    // Envia o email de redefinição
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
      existingUser.name ?? ""
    );

    return { success: "Email de redefinição de senha enviado!" };
  } catch (error) {
    console.error("Erro no processo de redefinição de senha:", error);
    return { error: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente." };
  }
};