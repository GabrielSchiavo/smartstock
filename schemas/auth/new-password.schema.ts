import { z } from "zod";
import { ConfirmPasswordSchema, PasswordSchema } from "@/schemas/shared/base.schema";

export const NewPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
