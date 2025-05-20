"use server";

import bcryptjs from "bcryptjs";
import { CreateUserSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendVerificationEmail } from "@/lib/send-mail";

export const registerUser = async (
  values: z.infer<typeof CreateUserSchema>
) => {
  const validateFields = CreateUserSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, userType } = validateFields.data;
  const hashedPassword = await bcryptjs.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
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
  
      return { success: "User successfully registered and confirmation email sent!" };
    } catch {
      return { error: "User registered successfully but error while sending confirmation email!" };
    };
    
  } catch {
    return { error: "Error registering user!" };
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
    console.error("Error fetching users:", error);
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
    console.error("Error deleting user:", error);
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
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const editUser = async (
  id: string,
  values: z.infer<typeof CreateUserSchema>
) => {
  const validateFields = CreateUserSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, userType } = validateFields.data;
  const hashedPassword = await bcryptjs.hash(password, 10);

  const existingUserEmail = await db.user.findUnique({
    where: {
      email,
      NOT: {
        id,
      },
    },
  });

  if (existingUserEmail) {
    return { error: "Email already in use!" };
  }

  try {
    // Verifica se o usuário existe
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return { error: "User not found!" };
    }

    // Atualiza o usuário
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
        role: userType,
      },
    });

    // Revalida os caminhos relevantes
    revalidatePath("/");

    return {
      success: "User updated successfully!",
      product: updatedUser,
    };
  } catch (error) {
    console.error("Error editing product:", error);
    return { error: "Failed to update product" };
  }
};
