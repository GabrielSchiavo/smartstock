import { z } from "zod";
import { EmailSchema, NameSchema, UserTypeSchema, OptionalPasswordSchema } from "@/schemas/shared/base.schema";

export const EditUserSchema = z
  .object({
    email: EmailSchema,
    name: NameSchema,
    userType: UserTypeSchema,
    password: OptionalPasswordSchema,
    confirmPassword: OptionalPasswordSchema,
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );