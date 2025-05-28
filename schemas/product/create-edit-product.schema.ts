import { z } from "zod";
import { ProductType, UnitType } from "@/types";

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
      .refine((v) => !isNaN(Number(v)) && v?.length > 0, {
        message: "Número inválido",
      }),
    unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      required_error: "Você precisa selecionar uma unidade de medida.",
    }),
    unitWeight: z
      .string()
      .min(1, { message: "Quantidade é obrigatória" })
      .max(10, { message: "Quantidade deve ter no máximo 10 caracteres" })
      .refine((v) => !isNaN(Number(v)) && v?.length > 0, {
        message: "Número inválido",
      })
      .optional(),
    unitOfUnitWeight: z
      .enum([UnitType.KG, UnitType.G, UnitType.L], {
        required_error: "Você precisa selecionar uma unidade de medida.",
      })
      .optional(),
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
  )
  .refine(
    (data) => !(data.unit === UnitType.UN && !data.unitWeight),
    {
      message: "Peso unitário é obrigatório para itens com unidade de medida 'UN'.",
      path: ["unitWeight"],
    }
  )
  .refine(
    (data) => !(data.unit === UnitType.UN && !data.unitOfUnitWeight),
    {
      message: "Unidade de peso unitário é obrigatória para itens com unidade de medida 'UN'.",
      path: ["unitOfUnitWeight"],
    }
  );
