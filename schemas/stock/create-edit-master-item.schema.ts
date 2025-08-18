import { z } from "zod";
import { UnitType } from "@/types";

export const CreateEditMasterItemSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome é obrigatório" })
      .max(60, { message: "Nome deve ter no máximo 60 caracteres" }),
    baseUnit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      required_error: "Você precisa selecionar uma unidade de medida base.",
    }),
    category: z
      .string()
      .min(2, { message: "Categoria é obrigatório" })
      .max(50, { message: "Categoria deve ter no máximo 50 caracteres" }),
    group: z
      .string()
      .min(2, { message: "Grupo é obrigatório" })
      .max(50, { message: "Grupo deve ter no máximo 50 caracteres" }),
    subgroup: z
      .string()
      .min(2)
      .max(50, { message: "Subgrupo deve ter no máximo 50 caracteres" })
      .optional(),
  })
