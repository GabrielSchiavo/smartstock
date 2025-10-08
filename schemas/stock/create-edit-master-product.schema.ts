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
        error: (issue) => {
          if (issue.input === undefined) {
            return { message: `Selecione a unidade de medida base.` };
          }
          if (issue.code === "invalid_value") {
            return { message: `Selecione a unidade de medida base.` };
          }

          return "Inválido.";
        },
      }),
  categoryId: z.string().trim().min(2, {
    error: "Categoria é obrigatório",
  }),
  groupId: z.string().trim().min(2, {
    error: "Grupo é obrigatório",
  }),
  subgroupId: z
    .string()
    .trim()
    .nullable()
    .optional(),
});
