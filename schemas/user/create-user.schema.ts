import { z } from "zod";
import { EmailSchema, NameSchema, UserTypeSchema, PasswordSchema, ConfirmPasswordSchema } from "@/schemas/shared/base-auth.schema";

export const CreateUserSchema = z
  .object({
    email: EmailSchema,
    name: NameSchema,
    userType: UserTypeSchema,
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
        error: "As senhas não coincidem"
    }
  );