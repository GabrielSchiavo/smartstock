import { z } from "zod";
import { ProductType, UnitType } from "@/types";

export const CreateEditProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Nome é obrigatório" })
      .max(60, { message: "Nome deve ter no máximo 60 caracteres" }),
    quantity: z
      .string()
      .trim()
      .min(1, { message: "Quantidade é obrigatória" })
      .max(10, { message: "Quantidade deve ter no máximo 10 caracteres" })
      .refine(
        (v) => {
          const n = Number(v);
          return !isNaN(n) && n > 0;
        },
        {
          message: "Número inválido. Use apenas números positivos.",
        }
      ),
    unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      required_error: "Você precisa selecionar uma unidade de medida.",
    }),
unitWeight: z
  .string()
  .trim()
  .max(10, { message: "Peso Unitário deve ter no máximo 10 caracteres" })
  .refine(
    (v) => {
      if (v === undefined || v === "") return true;
      const n = Number(v);
      return !isNaN(n) && n > 0;
    },
    {
      message: "Número inválido. Use apenas números positivos.",
    }
  )
  .optional(),
    unitOfUnitWeight: z
      .enum([UnitType.KG, UnitType.G, UnitType.L], {
        required_error: "Você precisa selecionar uma unidade de medida.",
      })
      .nullable()
      .optional(),
    lot: z
      .string()
      .trim()
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
      .trim()
      .min(2, { message: "Recebedor é obrigatório" })
      .max(30, { message: "Recebedor deve ter no máximo 30 caracteres" }),
    group: z
      .string()
      .trim()
      .min(2, { message: "Grupo é obrigatório" })
      .max(50, { message: "Grupo deve ter no máximo 50 caracteres" }),
    subgroup: z
      .string()
      .trim()
      .min(2)
      .max(50, { message: "Subgrupo deve ter no máximo 50 caracteres" })
      .optional(),
    productType: z.enum([ProductType.DONATED, ProductType.PURCHASED], {
      required_error: "Selecione um tipo de produto.",
    }),
    supplier: z
      .string()
      .trim()
      .min(2, { message: "Fornecedor é obrigatório" })
      .max(30, { message: "Fornecedor deve ter no máximo 30 caracteres" })
      .nullable()
      .optional(),
  })
  .refine(
    (data) => !(data.productType === ProductType.DONATED && !data.supplier),
    {
      message: "Fornecedor é obrigatório para itens doados.",
      path: ["supplier"],
    }
  );
