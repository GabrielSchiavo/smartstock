"use server";

import bcryptjs from "bcryptjs";
import { CreateUserSchema, EditUserSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { revalidatePath } from "next/cache";
import { sendVerificationEmail } from "@/lib/send-mail";
import { User } from "@prisma/client";
import { UserType } from "@/types";

export const registerUser = async (
  values: z.infer<typeof CreateUserSchema>
) => {
  const validateFields = CreateUserSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name, userType } = validateFields.data;
  const hashedPassword = await bcryptjs.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email já em uso!" };
  }

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userType,
      },
    });
    
    const verificationToken = await generateVerificationToken(email);
  
    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        name
      );
  
      return { success: "Usuário registrado com sucesso e email de confirmação enviado!" };
    } catch {
      return { error: "Usuário registrado com sucesso, mas erro ao enviar email de confirmação!" };
    };
    
  } catch {
    return { error: "Erro ao registrar usuário!" };
  }
};

export async function getUsers(): Promise<User[]> {
  try {
    const users = await db.user.findMany({
      orderBy: {
        role: "asc",
      },
    });
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

export async function deleteUser(
  id: string //identify which plant we are editing
) {
  try {
    const deletedUser = await db.user.delete({
      where: { id },
    });
    revalidatePath("/");
    return deletedUser;
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw error;
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw new Error("Falha ao buscar o usuário");
  }
};

export const editUser = async (
  id: string,
  values: z.infer<typeof EditUserSchema>
) => {
  const validateFields = EditUserSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name, userType } = validateFields.data;

  const existingUserEmail = await db.user.findUnique({
    where: {
      email,
      NOT: {
        id,
      },
    },
  });

  if (existingUserEmail) {
    return { error: "Email já em uso!" };
  }

  try {
    // Verifica se o usuário existe
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return { error: "Usuário não encontrado!" };
    }

    // Atualiza o usuário
    const updateData: {
      name: string;
      email: string;
      role: UserType;
      password?: string;
    } = {
      name,
      email,
      role: userType as UserType,
    };

      // const hashedPassword = await bcryptjs.hash(password, 10);

    // Revalida os caminhos relevantes
    // Apenas atualiza a senha se foi fornecida e não está vazia
    if (password && password.trim().length > 0) {
      updateData.password = await bcryptjs.hash(password, 10);
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");

    return {
      success: "Usuário atualizado com sucesso!",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Erro ao editar o produto:", error);
    return { error: "Falha ao atualizar o produto" };
  }
};
