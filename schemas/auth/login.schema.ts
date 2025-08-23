import { z } from "zod";
import { EmailSchema } from "@/schemas/shared/base.schema";

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(1, {
        error: "Senha é obrigatória"
    })
    .refine((val) => !/\s/.test(val), {
        error: "A senha não pode conter espaços em branco"
    }),
});