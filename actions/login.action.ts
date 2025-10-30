"use server";

import { z } from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT, ROUTES } from "@/config/routes";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/utils/send-mail";
import { auditLogRepository, userRepository } from "@/db";
import { ActionType, EntityType } from "@/types";
import { getIpAddress } from "@/utils/ip-address-utils";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validação dos campos de entrada
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { email, password } = validatedFields.data;

  // Verificação do usuário existente
  const existingUser = await userRepository.findByEmail(email);

  if (!existingUser?.email || !existingUser.password) {
    await auditLogRepository.create({
      createdAt: new Date(),
      userId: null,
      recordChangedId: null,
      actionType: ActionType.LOGIN_FAILURE,
      entity: EntityType.SYSTEM,
      changedValue: null,
      ipAddress: await getIpAddress(),
      targetEmail: email,
      details: `[SYSTEM] Action='${ActionType.LOGIN_FAILURE}' | Entity='${EntityType.SYSTEM}' | Email Target='${email}' | IP Address='${await getIpAddress()}' | Message='User Not Found' | Date Time='${new Date().toISOString()}'`,
    });

    return { error: "Credenciais inválidas!" };
  }

  // Verificação de email não confirmado
  if (!existingUser.emailVerified) {
    try {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        existingUser.name ?? ""
      );

      return { success: "Email de confirmação enviado!" };
    } catch (error) {
      console.error("Erro ao enviar email de confirmação:", error);
      return { error: "Erro ao enviar email de confirmação!" };
    }
  }

  // Tentativa de login
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Explicitly enable redirect
    });

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: existingUser.id as string,
      recordChangedId: null,
      actionType: ActionType.LOGIN,
      entity: EntityType.SYSTEM,
      changedValue: null,
      ipAddress: await getIpAddress(),
      details: `[SYSTEM] Action='${ActionType.LOGIN}' | Entity='${EntityType.SYSTEM}' | User ID='${existingUser.id}' | User='${existingUser.name}' | IP Address='${await getIpAddress()}' | Message='Login Successful' | Date Time='${new Date().toISOString()}'`,
    });

    return {
      success: "Login realizado com sucesso! Redirecionando...",
      redirectUrl: DEFAULT_LOGIN_REDIRECT,
      shouldReload: DEFAULT_LOGIN_REDIRECT === ROUTES.PAGE_DASHBOARD, // Adiciona flag para recarregar
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          await auditLogRepository.create({
            createdAt: new Date(),
            userId: null,
            recordChangedId: null,
            actionType: ActionType.LOGIN_FAILURE,
            entity: EntityType.SYSTEM,
            changedValue: null,
            ipAddress: await getIpAddress(),
            targetEmail: email,
            details: `[SYSTEM] Action='${ActionType.LOGIN_FAILURE}' | Entity='${EntityType.SYSTEM}' | Email Target='${email}' | IP Address='${await getIpAddress()}' | Message='User Found, but Invalid Credentials' | Date Time='${new Date().toISOString()}'`,
          });

          return { error: "Credenciais inválidas!" };
        default:
          console.error("Erro de autenticação:", error);
          return { error: "Algo deu errado durante a autenticação!" };
      }
    }

    console.error("Erro inesperado:", error);
    throw error;
  }
};
