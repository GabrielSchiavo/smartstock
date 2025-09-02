import { BaseUnitType } from "@/types";
import { z } from "zod";

export const CreateEditMasterProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      error: "Nome é obrigatório",
    })
    .max(60, {
      error: "Nome deve ter no máximo 60 caracteres",
    }),
  baseUnit: z.enum([BaseUnitType.KG, BaseUnitType.UN, BaseUnitType.L], {
    error: (issue) =>
      issue.input === undefined
        ? "Selecione uma unidade de medida base"
        : undefined,
  }),
  category: z
    .string()
    .trim()
    .min(2, {
      error: "Categoria é obrigatório",
    })
    .max(50, {
      error: "Categoria deve ter no máximo 50 caracteres",
    }),
  group: z
    .string()
    .trim()
    .min(2, {
      error: "Grupo é obrigatório",
    })
    .max(50, {
      error: "Grupo deve ter no máximo 50 caracteres",
    }),
  subgroup: z
    .string()
    .trim()
    .min(2)
    .max(50, {
      error: "Subgrupo deve ter no máximo 50 caracteres",
    })
    .optional(),
});
