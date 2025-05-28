"use server";

import bcryptjs from "bcryptjs";
import { CreateUserSchema, EditUserSchema } from "@/schemas";
import { z } from "zod";
import { userRepository } from '@/db';
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/send-mail";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";
import { UserOperationResponse } from "@/types";

export const registerUser = async (
  values: z.infer<typeof CreateUserSchema>
): Promise<UserOperationResponse> => {
  // Validação dos campos
  const validationResult = CreateUserSchema.safeParse(values);
  if (!validationResult.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name, userType } = validationResult.data;

  try {
    // Verificação de email existente
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return { error: "Email já em uso!" };
    }

    // Criação do usuário
    const hashedPassword = await bcryptjs.hash(password, 10);
    await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: userType,
    });

    // Envio de email de verificação
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token, name);

    revalidatePath("/");
    return { success: "Usuário registrado com sucesso e email de confirmação enviado!" };

  } catch (error) {
    console.error("Erro no registro de usuário:", error);
    return { error: "Erro ao registrar usuário!" };
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await userRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Falha ao carregar lista de usuários");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await userRepository.delete(id);
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw new Error("Falha ao excluir usuário");
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw new Error("Falha ao buscar o usuário");
  }
};

export const editUser = async (
  id: string,
  values: z.infer<typeof EditUserSchema>
): Promise<UserOperationResponse> => {
  // Validação dos campos
  const validationResult = EditUserSchema.safeParse(values);
  if (!validationResult.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name, userType } = validationResult.data;

  try {
    // Verificação de email existente
    const existingUserEmail = await userRepository.findByEmailExcludingId(email, id);
    if (existingUserEmail) {
      return { error: "Email já em uso!" };
    }

    // Verifica se o usuário existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      return { error: "Usuário não encontrado!" };
    }

    // Prepara dados para atualização
    const updateData = {
      name,
      email,
      role: userType,
      ...(password && { password: await bcryptjs.hash(password, 10) }),
    };

    // Atualiza o usuário
    const updatedUser = await userRepository.update(id, updateData);
    revalidatePath("/");

    return {
      success: "Usuário atualizado com sucesso!",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    return { error: "Falha ao atualizar o usuário" };
  }
};