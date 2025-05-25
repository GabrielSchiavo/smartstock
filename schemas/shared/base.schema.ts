import { z } from "zod";
import { UserType } from "@/types";

// Campos básicos reutilizáveis
export const PasswordSchema = z
  .string()
  .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
  .max(32, { message: "A senha deve ter no máximo 32 caracteres" })
  .regex(/[A-Z]/, {
    message: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .regex(/[a-z]/, {
    message: "A senha deve conter pelo menos uma letra minúscula",
  })
  .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número" })
  .regex(/[^A-Za-z0-9]/, {
    message: "A senha deve conter pelo menos um caractere especial",
  })
  .refine((val) => !/\s/.test(val), {
    message: "A senha não pode conter espaços em branco",
  });

export const OptionalPasswordSchema = PasswordSchema.optional();

export const EmailSchema = z.string().email({
  message: "Email é obrigatório",
});

export const NameSchema = z.string().min(1, {
  message: "Nome é obrigatório",
});

export const UserTypeSchema = z.enum(
  [UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE, UserType.REPORT],
  {
    required_error: "Você precisa selecionar um tipo de usuário.",
  }
);