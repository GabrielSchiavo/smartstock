"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/send-mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { z } from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  try {
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
      existingUser.name!
    );

    return { success: "Reset password email sent!" };
  } catch {
    return { error: "Error while sending reset password email!" };
  }
};
