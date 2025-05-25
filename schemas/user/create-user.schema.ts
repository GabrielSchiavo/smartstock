import { z } from "zod";
import { EmailSchema, NameSchema, UserTypeSchema, PasswordSchema } from "../shared/base.schema";

export const CreateUserSchema = z
  .object({
    email: EmailSchema,
    name: NameSchema,
    userType: UserTypeSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );