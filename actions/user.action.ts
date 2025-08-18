"use server";

import bcryptjs from "bcryptjs";
import { CreateUserSchema, EditUserSchema } from "@/schemas";
import { z } from "zod";
import { userRepository } from "@/db";
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
  if (validationResult.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { email, password, name, userType } = validationResult.data;

  try {
    // Verificação de email existente
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        title: "Erro!",
        description: "Este email já está em uso.",
      };
    }

    // Envio de email de verificação
    const verificationToken = await generateVerificationToken(email);
    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        name
      );
    } catch (error) {
      console.error("Erro ao enviar o email de verificação:", error);
      return {
        success: false,
        title: "Erro!",
        description: "Não foi possível enviar o email de verificação.",
      };
    }

    // Criação do usuário
    const hashedPassword = await bcryptjs.hash(password, 10);
    await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: userType,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Usuário registrado. Um email de verificação foi enviado.",
    };
  } catch (error) {
    console.error("Erro no registro de usuário:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível registrar o usuário.",
    };
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await userRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Erro ao carregar lista de usuários.");
  }
};

export const deleteUser = async (id: string) => {
  try {
    await userRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: `Usuário com ID ${id} excluído com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível excluir o usuário.",
    };
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
    throw new Error("Erro ao buscar o usuário");
  }
};

export const editUser = async (
  id: string,
  values: z.infer<typeof EditUserSchema>
): Promise<UserOperationResponse> => {
  // Validação dos campos
  const validationResult = EditUserSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { email, password, name, userType } = validationResult.data;

  try {
    // Verifica se o usuário existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      return {
        success: false,
        title: "Erro!",
        description: "Usuário não encontrado.",
      };
    }

    const isEmailChanged = existingUser.email !== email;
    let requiresVerification = false;

    // Verificação de email somente se for alterado
    if (isEmailChanged) {
      const existingUserEmail = await userRepository.findByEmailExcludingId(
        email,
        id
      );

      if (existingUserEmail) {
        return {
          success: false,
          title: "Erro!",
          description: "Este email já está em uso.",
        };
      }
    }

    // Envia email de verificação se o email foi alterado
    if (isEmailChanged) {
      const verificationToken = await generateVerificationToken(email);
      try {
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token,
          name
        );
      } catch (error) {
        console.error("Erro ao enviar o email de verificação:", error);
        return {
          success: false,
          title: "Erro!",
          description: "Não foi possível enviar o email de verificação.",
        };
      }
    }

    // Prepara dados para atualização
    const updateData = {
      name,
      email,
      role: userType,
      emailVerified: existingUser.emailVerified, // Mantém o status de verificação atual
      ...(password && { password: await bcryptjs.hash(password, 10) }),
    };

    // Se o email foi alterado, marca como não verificado
    if (isEmailChanged) {
      updateData.emailVerified = null;
      requiresVerification = true;
    }

    // Atualiza o usuário
    const updatedUser = await userRepository.update(id, updateData);

    revalidatePath("/");

    return {
      success: true,
      title: "Sucesso!",
      description: requiresVerification
        ? "Usuário atualizado. Um email de verificação foi enviado para o novo email."
        : "Usuário atualizado com sucesso.",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível atualizar o usuário.",
    };
  }
};
