import { z } from "zod";
import { UserType } from "@/types";

// Campos básicos reutilizáveis
export const PasswordSchema = z
  .string()
  .trim()
  .min(1, {
    error: "Senha é obrigatória",
  })
  .min(8, {
    error: "A senha deve ter no mínimo 8 caracteres",
  })
  .max(32, {
    error: "A senha deve ter no máximo 32 caracteres",
  })
  .regex(/[A-Z]/, {
    error: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .regex(/[a-z]/, {
    error: "A senha deve conter pelo menos uma letra minúscula",
  })
  .regex(/[0-9]/, {
    error: "A senha deve conter pelo menos um número",
  })
  .regex(/[^A-Za-z0-9]/, {
    error: "A senha deve conter pelo menos um caractere especial",
  })
  .refine((val) => !/\s/.test(val), {
    error: "A senha não pode conter espaços em branco",
  });

export const ConfirmPasswordSchema = z
  .string()
  .trim()
  .min(1, {
    error: "Confirme a senha é obrigatória",
  })
  .refine((val) => !/\s/.test(val), {
    error: "A senha não pode conter espaços em branco",
  });

export const OptionalPasswordSchema = PasswordSchema.optional();
export const OptionalConfirmPasswordSchema = ConfirmPasswordSchema.optional();

export const EmailSchema = z
  .email({
    error: "Email é obrigatório",
  })
  .trim();

export const NameSchema = z
  .string()
  .trim()
  .min(1, {
    error: "Nome é obrigatório",
  })
  .max(50, {
    error: "O nome deve ter no máximo 50 caracteres",
  });

export const UserTypeSchema = z.enum(
  [UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE, UserType.REPORT],
  {
    error: (issue) =>
      issue.input === undefined
        ? "Você precisa selecionar um tipo de usuário."
        : undefined,
  }
);
