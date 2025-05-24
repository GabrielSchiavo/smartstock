import { ProductType, UnitMeasurement, UserRole } from "@prisma/client";
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
      [UserRole.ADMIN, UserRole.DEFAULT, UserRole.CADASTRE, UserRole.REPORT],
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
      [UserRole.ADMIN, UserRole.DEFAULT, UserRole.CADASTRE, UserRole.REPORT],
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
    name: z.string().min(2).max(60),
    quantity: z
      .string()
      .min(1)
      .max(10)
      .refine(
        (v) => {
          const n = Number(v);
          return !isNaN(n) && v?.length > 0;
        },
        { message: "Número inválido" }
      ),
    unit: z.enum(
      [
        UnitMeasurement.KG,
        UnitMeasurement.G,
        UnitMeasurement.L,
        UnitMeasurement.UN,
      ],
      {
        required_error: "Você precisa selecionar uma unidade de medida.",
      }
    ),
    lot: z.string().min(2).max(30),

    validityDate: z.coerce.date({
      required_error: "Selecione uma data",
      invalid_type_error: "Isto não é uma data válida!",
    }),
    // .refine((date) => date > new Date(), {
    //   message: "The date entered must be greater than today's date",
    // }),

    receiptDate: z.coerce.date({
      required_error: "Selecione uma data",
      invalid_type_error: "Isto não é uma data válida!",
    }),

    receiver: z.string().min(2).max(150),
    group: z.string().min(2).max(50),
    subgroup: z.string().min(2).max(50).optional(),

    productType: z.enum([ProductType.DONATED, ProductType.PURCHASED], {
      required_error: "Selecione um tipo de produto.",
    }),

    donor: z.string().min(2).max(30).optional(),
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
      })
      .optional(),
    finalDate: z.coerce
      .date({
        required_error: "Por favor selecione uma data final.",
        invalid_type_error: "Data inválida",
      })
      .optional(),
    reportType: z.enum(["VALIDITY", "DONATIONS", "PURCHASED", "INVENTORY"], {
      required_error: "Selecione o tipo de relatório.",
    }),
  })
  .refine(
    (data) => {
      if (
        data.reportType !== "INVENTORY" &&
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
      if (data.reportType !== "INVENTORY" && !data.initialDate) {
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
      if (data.reportType !== "INVENTORY" && !data.finalDate) {
        return false;
      }
      return true;
    },
    {
      message: "Data Final é obrigatório.",
      path: ["finalDate"],
    }
  );
