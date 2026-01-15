"use server";

import { verificationTokenRepository, userRepository } from "@/db";

export const newVerification = async (token: string) => {
  try {
    // Verificação do token
    const existingToken = await verificationTokenRepository.findByToken(token);
    
    if (!existingToken) {
      return { error: "Token de verificação inválido!" };
    }

    // Verificação de expiração do token
    const hasExpired = new Date(existingToken.expires) < new Date();
    
    if (hasExpired) {
      return { error: "Token de verificação expirado!" };
    }

    // Verificação do usuário associado
    const existingUser = await userRepository.findByEmail(existingToken.email);
    
    if (!existingUser) {
      return { error: "Usuário não encontrado!" };
    }

    // Atualização do status de verificação
    await userRepository.verifyEmail(
      existingUser.id,
      existingToken.email
    );

    // Limpeza do token utilizado
    await verificationTokenRepository.delete(existingToken.id);

    return { success: "Email verificado com sucesso!" };
  } catch (error) {
    console.error("Erro durante a verificação de email:", error);
    return { error: "Ocorreu um erro ao verificar o email. Por favor, tente novamente." };
  }
};