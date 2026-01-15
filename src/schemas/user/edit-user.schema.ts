import { z } from "zod";
import { EmailSchema, NameSchema, UserTypeSchema, OptionalPasswordSchema, OptionalConfirmPasswordSchema } from "@/schemas/shared/base-auth.schema";

export const EditUserSchema = z
  .object({
    email: EmailSchema,
    name: NameSchema,
    userType: UserTypeSchema,
    password: OptionalPasswordSchema,
    confirmPassword: OptionalConfirmPasswordSchema,
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
        error: "As senhas não coincidem"
    }
  );