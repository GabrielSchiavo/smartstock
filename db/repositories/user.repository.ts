import { db } from "@/lib/db";
import { UserResponse, UserSettingsUpdateResponse } from "@/types";
import { Prisma, User } from "@prisma/client";

export const userRepository = {
  async findByEmail(email: string) {
    try {
      return await db.user.findUnique({ where: { email } });
    } catch {
      return null;
    }
  },

  async findById(id: string) {
    try {
      return await db.user.findUnique({ where: { id } });
    } catch {
      return null;
    }
  },

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  async verifyEmail(userId: string, email: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
        email: email,
      },
    });
  },

  async create(data: UserResponse, tx?: Prisma.TransactionClient): Promise<User> {
    const client = tx ?? db;

    return (await client.user.create({ data })) as User;
  },

  async findAll(): Promise<User[]> {
    return await db.user.findMany({
      orderBy: { role: "asc" },
    });
  },

  async findByEmailExcludingId(
    email: string,
    id: string
  ): Promise<User | null> {
    return await db.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });
  },

  async update(id: string, data: UserResponse, tx?: Prisma.TransactionClient): Promise<User> {
    const client = tx ?? db;

    return await client.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? db;

    await client.user.delete({ where: { id } });
  },

  async updateSettings(userId: string, values: UserSettingsUpdateResponse) {
    return db.user.update({
      where: { id: userId },
      data: { ...values },
    });
  },

  async updateEmail(userId: string, email: string) {
    return db.user.update({
      where: { id: userId },
      data: { email, emailVerified: null },
    });
  },
};
