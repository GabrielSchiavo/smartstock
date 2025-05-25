import * as z from "zod";
import { ProductType, UnitType, UserType, ReportType } from "@/types";

// Schemas reutilizáveis
const PasswordSchema = z
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

const OptionalPasswordSchema = PasswordSchema.optional();

const EmailSchema = z.string().email({
  message: "Email é obrigatório",
});

const NameSchema = z.string().min(1, {
  message: "Nome é obrigatório",
});

const UserTypeSchema = z.enum(
  [UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE, UserType.REPORT],
  {
    required_error: "Você precisa selecionar um tipo de usuário.",
  }
);

// Schemas principais
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

export const NewPasswordSchema = z.object({
  password: PasswordSchema,
});

export const ResetSchema = z.object({
  email: EmailSchema,
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(1, { message: "Senha é obrigatória" })
    .refine((val) => !/\s/.test(val), {
      message: "A senha não pode conter espaços em branco",
    }),
});

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

export const CreateEditProductSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome é obrigatório" })
      .max(60, { message: "Nome deve ter no máximo 60 caracteres" }),
    quantity: z
      .string()
      .min(1, { message: "Quantidade é obrigatória" })
      .max(10, { message: "Quantidade deve ter no máximo 10 caracteres" })
      .refine(
        (v) => !isNaN(Number(v)) && v?.length > 0,
        { message: "Número inválido" }
      ),
    unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      required_error: "Você precisa selecionar uma unidade de medida.",
    }),
    lot: z
      .string()
      .min(2, { message: "Lote é obrigatório" })
      .max(30, { message: "Lote deve ter no máximo 30 caracteres" }),
    validityDate: z.coerce.date({
      required_error: "Selecione uma data",
      invalid_type_error: "Data inválida",
      message: "Selecione uma data.",
    }),
    receiptDate: z.coerce.date({
      required_error: "Selecione uma data",
      invalid_type_error: "Data inválida",
      message: "Selecione uma data.",
    }),
    receiver: z
      .string()
      .min(2, { message: "Recebedor é obrigatório" })
      .max(30, { message: "Recebedor deve ter no máximo 30 caracteres" }),
    group: z
      .string()
      .min(2, { message: "Grupo é obrigatório" })
      .max(50, { message: "Grupo deve ter no máximo 50 caracteres" }),
    subgroup: z
      .string()
      .min(2)
      .max(50, { message: "Subgrupo deve ter no máximo 50 caracteres" })
      .optional(),
    productType: z.enum([ProductType.DONATED, ProductType.PURCHASED], {
      required_error: "Selecione um tipo de produto.",
    }),
    donor: z
      .string()
      .min(2, { message: "Doador é obrigatório" })
      .max(30, { message: "Doador deve ter no máximo 30 caracteres" })
      .optional(),
  })
  .refine(
    (data) => !(data.productType === ProductType.DONATED && !data.donor),
    {
      message: "Detalhes são obrigatórios para itens doados.",
      path: ["donor"],
    }
  );

export const CreateReportSchema = z
  .object({
    initialDate: z.coerce
      .date({
        required_error: "Por favor selecione uma data inicial.",
        invalid_type_error: "Data inválida",
        message: "Selecione uma data.",
      })
      .optional(),
    finalDate: z.coerce
      .date({
        required_error: "Por favor selecione uma data final.",
        invalid_type_error: "Data inválida",
        message: "Selecione uma data.",
      })
      .optional(),
    reportType: z.enum(
      [
        ReportType.VALIDITY,
        ReportType.DONATIONS,
        ReportType.PURCHASED,
        ReportType.INVENTORY,
      ],
      {
        required_error: "Selecione o tipo de relatório.",
      }
    ),
  })
  .refine(
    (data) => !(
      data.reportType !== ReportType.INVENTORY && 
      data.finalDate && 
      data.initialDate && 
      data.finalDate < data.initialDate
    ),
    {
      message: "A data final não pode ser menor que a data inicial.",
      path: ["finalDate"],
    }
  )
  .refine(
    (data) => !(data.reportType !== ReportType.INVENTORY && !data.initialDate),
    {
      message: "Data Inicial é obrigatória.",
      path: ["initialDate"],
    }
  )
  .refine(
    (data) => !(data.reportType !== ReportType.INVENTORY && !data.finalDate),
    {
      message: "Data Final é obrigatória.",
      path: ["finalDate"],
    }
  );