import { z } from "zod";
import { EmailSchema, NameSchema, UserTypeSchema, PasswordSchema, ConfirmPasswordSchema } from "@/schemas/shared/base.schema";

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
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );