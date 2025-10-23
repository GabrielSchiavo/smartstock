"use server";

import { currentRole } from "@/utils/current-session-utils";
import { AuthorizationResponse, UserType } from "@/types";

export const verifyAdminAccess = async (): Promise<AuthorizationResponse> => {
  try {
    const role = await currentRole();

    if (role === UserType.ADMIN) {
      return {
        success: true,
        title: "Sucesso!",
        description: "Acesso autorizado para administrador.",
        isAuthorized: true,
      };
    }

    return {
      success: false,
      title: "Erro!",
      description: "Acesso restrito - Requer privilégios de administrador",
      isAuthorized: false,
    };
  } catch (error) {
    console.error("Erro na verificação de permissões:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro interno na verificação de autorização",
      isAuthorized: false,
    };
  }
};
