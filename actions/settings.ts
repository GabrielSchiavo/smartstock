"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/send-mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Não autorizado!" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Não autorizado!" };
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email já em uso!" };
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
        emailVerified: null,
      },
    });

    const userName = dbUser.name as string;
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      userName
    );

    return { success: "Email de verificação enviado!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordMatch) {
      return { error: "Senha Atual Inválida!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Configurações Atualizadas!", error: undefined };
};
