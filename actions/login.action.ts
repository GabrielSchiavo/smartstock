"use server";

import { z } from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/send-mail";
import { userRepository } from "@/db";
import { revalidatePath } from "next/cache";

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
    return { error: "O e-mail não existe!" };
  }

  // Verificação de e-mail não confirmado
  if (!existingUser.emailVerified) {
    try {
      const verificationToken = await generateVerificationToken(existingUser.email);
      
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        existingUser.name ?? ""
      );

      return { success: "E-mail de confirmação enviado!" };
    } catch (error) {
      console.error("Erro ao enviar e-mail de confirmação:", error);
      return { error: "Erro ao enviar e-mail de confirmação!" };
    }
  }

  // Tentativa de login
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: "Login realizado com sucesso!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
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