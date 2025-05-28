import { z } from "zod";
import { EmailSchema, PasswordSchema } from "@/schemas/shared/base.schema";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(EmailSchema),
    password: z.optional(
      z.string().refine((val) => !/\s/.test(val), {
        message: "A senha não pode conter espaços em branco",
      })
    ),
    newPassword: z
      .union([
        z.string().length(0),
        PasswordSchema,
      ])
      .transform((e) => (e === "" ? undefined : e))
      .optional(),
  })
  .refine(
    (data) => !(data.password && !data.newPassword),
    {
      message: "Nova Senha é obrigatória!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => !(data.newPassword && !data.password),
    {
      message: "Senha é obrigatória!",
      path: ["password"],
    }
  );