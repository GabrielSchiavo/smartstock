import { z } from "zod";
import { EmailSchema } from "@/schemas/shared/base-auth.schema";

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .trim()
    .min(1, {
        error: "Senha é obrigatória"
    })
    .refine((val) => !/\s/.test(val), {
        error: "A senha não pode conter espaços em branco"
    }),
});