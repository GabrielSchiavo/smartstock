import { z } from "zod";
import { ConfirmPasswordSchema, PasswordSchema } from "@/schemas/shared/base.schema";

export const NewPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
      error: "As senhas não coincidem"
});
