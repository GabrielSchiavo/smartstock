import { z } from "zod";
import { EmailSchema, NameSchema, PasswordSchema } from "@/schemas/shared/base-auth.schema";

export const SettingsSchema = z
  .object({
    name: z.optional(NameSchema),
    email: z.optional(EmailSchema),
    password: z.optional(
      z.string().refine((val) => !/\s/.test(val), {
          error: "A senha não pode conter espaços em branco"
    })
    ),
    newPassword: z
      .union([
        z.string().length(0, {
            error: "Nova senha não pode ser informada se o campo Senha atual não for preenchido"
        }),
        PasswordSchema,
      ])
      .transform((e) => (e === "" ? undefined : e))
      .optional(),
  })
  .refine(
    (data) => !(data.password && !data.newPassword),
    {
      path: ["newPassword"],
        error: "Nova senha é obrigatória!"
    }
  )
  .refine(
    (data) => !(data.newPassword && !data.password),
    {
      path: ["password"],
        error: "Senha atual é obrigatória!"
    }
  );