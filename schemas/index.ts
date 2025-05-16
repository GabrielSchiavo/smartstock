import { ProductType, UnitMeasurement, UserRole } from "@prisma/client";
import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Passwor is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const CreateUserSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    userType: z.enum([UserRole.ADMIN, UserRole.DEFAULT, UserRole.CADASTRE, UserRole.REPORT], {
      required_error: "You need to select a user input type.",
    }),

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

    confirmPassword: z.string().min(8).max(32),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // path of error
  });

export const CreateProductSchema = z
  .object({
    name: z.string().min(2).max(150),
    quantity: z.string().min(1).max(10).refine(v => { const n = Number(v); return !isNaN(n) && v?.length > 0}, {message: "Invalid number"}),
    unit: z.enum([UnitMeasurement.KG, UnitMeasurement.G, UnitMeasurement.L, UnitMeasurement.UN, UnitMeasurement.CX], {
      required_error: "You need to select a unit of measurement.",
    }),
    lot: z.string().min(2).max(50),

    validityDate: z.coerce
      .date({
        required_error: "Please select a date",
        invalid_type_error: "This is not a date!",
      }),
      // .refine((date) => date > new Date(), {
      //   message: "The date entered must be greater than today's date",
      // }),

    receiptDate: z.coerce.date({
      required_error: "Please select a date",
      invalid_type_error: "This is not a date!",
    }),

    receiver: z.string().min(2).max(150),
    group: z.string().min(2).max(50),
    subgroup: z.string().min(2).max(50).optional(),

    productType: z.enum([ProductType.DONATED, ProductType.PURCHASED], {
      required_error: "You need to select a product input type.",
    }),

    donor: z.string().min(2).max(150).optional(),
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
      message: "Detalhes são obrigatórios para itens doados",
      path: ["donor"], // Especifica que o erro deve ser associado ao campo donor
    }
  );

  export const CreateReportSchema = z
  .object({
    initialDate: z.coerce
    .date({
      required_error: "Please select a date",
      invalid_type_error: "This is not a date!",
    }),
  
    finalDate: z.coerce
    .date({
      required_error: "Please select a date",
      invalid_type_error: "This is not a date!",
    }),
  
    name: z.string().min(2).max(150),
  
    userType: z.enum(
      [
        "QUANTITY",
        "EXPIRYDATE",
        "EXPIRED",
        "QUANTITYDONATED",
        "TOTALRECEIVED",
      ],
      {
        required_error: "You need to select a report input type.",
      }
    ),
  }).refine((data) => data.finalDate > data.initialDate, {
    message: "The end date cannot be less than the start date",
    path: ["finalDate"], // path of error
  });
