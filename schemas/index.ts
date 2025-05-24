import { ReportType } from "@/types";
import { ProductType, UnitType, UserType } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),

    password: z.optional(
      z.string().refine((val) => !/\s/.test(val), {
        message: "A senha não pode conter espaços em branco",
      })
    ),

    newPassword: z
      .union([
        z.string().length(0), // Aceita string vazia
        z
          .string()
          .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
          .max(32, { message: "A senha deve ter no máximo 32 caracteres" })
          .regex(/[A-Z]/, {
            message: "A senha deve conter pelo menos uma letra maiúscula",
          })
          .regex(/[a-z]/, {
            message: "A senha deve conter pelo menos uma letra minúscula",
          })
          .regex(/[0-9]/, {
            message: "A senha deve conter pelo menos um número",
          })
          .regex(/[^A-Za-z0-9]/, {
            message: "A senha deve conter pelo menos um caractere especial",
          })
          .refine((val) => !/\s/.test(val), {
            message: "A senha não pode conter espaços em branco",
          }),
      ])
      .transform((e) => (e === "" ? undefined : e))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Nova Senha é obrigatório!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Senha é obrigatório!",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z
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
    }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email é obrigatório",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email é obrigatório",
  }),
  password: z
    .string()
    .min(1, { message: "Senha é obrigatório" })
    .refine((val) => !/\s/.test(val), {
      message: "A senha não pode conter espaços em branco",
    }),
});

export const CreateUserSchema = z
  .object({
    email: z.string().email({
      message: "Email é obrigatório",
    }),
    name: z.string().min(1, {
      message: "Nome é obrigatório",
    }),
    userType: z.enum(
      [UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE, UserType.REPORT],
      {
        required_error: "Você precisa selecionar um tipo de usuário.",
      }
    ),

    password: z
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
      }),

    confirmPassword: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .max(32, { message: "A senha deve ter no máximo 32 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // path of error
  });
export const EditUserSchema = z
  .object({
    email: z.string().email({
      message: "Email é obrigatório",
    }),
    name: z.string().min(1, {
      message: "Nome é obrigatório",
    }),
    userType: z.enum(
      [UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE, UserType.REPORT],
      {
        required_error: "Você precisa selecionar um tipo de usuário.",
      }
    ),

    password: z.optional(
      z
        .string()
        // .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
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
        })
    ),

    confirmPassword: z.optional(
      z
        .string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
        .max(32, { message: "A senha deve ter no máximo 32 caracteres" })
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // path of error
  });

export const CreateProductSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome é obrigatório" })
      .max(60, { message: "Nome deve ter no máximo 60 caracteres" }),
    quantity: z
      .string()
      .min(1, { message: "Quantidade é obrigatório" })
      .max(10, { message: "Quantidade deve ter no máximo 10 caracteres" })
      .refine(
        (v) => {
          const n = Number(v);
          return !isNaN(n) && v?.length > 0;
        },
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
      invalid_type_error: "Isto não é uma data válida!",
      message: "Selecione uma data.",
    }),
    // .refine((date) => date > new Date(), {
    //   message: "The date entered must be greater than today's date",
    // }),

    receiptDate: z.coerce.date({
      required_error: "Selecione uma data",
      invalid_type_error: "Isto não é uma data válida!",
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
    (data) => {
      // Validação condicional sem usar parent
      if (data.productType === ProductType.DONATED && !data.donor) {
        return false;
      }
      return true;
    },
    {
      message: "Detalhes são obrigatórios para itens doados.",
      path: ["donor"], // Especifica que o erro deve ser associado ao campo donor
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
    (data) => {
      if (
        data.reportType !== ReportType.INVENTORY &&
        data.finalDate! < data.initialDate!
      ) {
        return false;
      }
      return true;
    },
    {
      message: "A data final não pode ser menor que a data inicial.",
      path: ["finalDate"],
    }
  )
  .refine(
    (data) => {
      if (data.reportType !== ReportType.INVENTORY && !data.initialDate) {
        return false;
      }
      return true;
    },
    {
      message: "Data Inicial é obrigatório.",
      path: ["initialDate"],
    }
  )
  .refine(
    (data) => {
      if (data.reportType !== ReportType.INVENTORY && !data.finalDate) {
        return false;
      }
      return true;
    },
    {
      message: "Data Final é obrigatório.",
      path: ["finalDate"],
    }
  );
