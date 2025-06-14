import { z } from "zod";
import { EmailSchema, NameSchema, PasswordSchema } from "@/schemas/shared/base.schema";

export const SettingsSchema = z
  .object({
    name: z.optional(NameSchema),
    email: z.optional(EmailSchema),
    password: z.optional(
      z.string().refine((val) => !/\s/.test(val), {
        message: "A senha não pode conter espaços em branco",
      })
    ),
    newPassword: z
      .union([
        z.string().length(0, {
          message: "Nova senha não pode ser informada se o campo Senha atual não for preenchido",
        }),
        PasswordSchema,
      ])
      .transform((e) => (e === "" ? undefined : e))
      .optional(),
  })
  .refine(
    (data) => !(data.password && !data.newPassword),
    {
      message: "Nova senha é obrigatória!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => !(data.newPassword && !data.password),
    {
      message: "Senha atual é obrigatória!",
      path: ["password"],
    }
  );