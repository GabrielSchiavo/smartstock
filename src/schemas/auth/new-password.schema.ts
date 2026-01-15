import { z } from "zod";
import { ConfirmPasswordSchema, PasswordSchema } from "@/schemas/shared/base-auth.schema";

export const NewPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
      error: "As senhas não coincidem"
});
