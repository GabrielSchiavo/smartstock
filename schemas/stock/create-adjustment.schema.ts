import { z } from "zod";
import {
  AdjustmentMovementCategoryType,
  AdjustmentType,
  UnitType,
} from "@/types";

export const CreateAdjustmentSchema = z.object({
  productId: z.string().trim().min(1, {
    error: "Produto é obrigatório",
  }),
  lot: z
    .string()
    .trim()
    .min(2, {
      error: "Selecione um produto",
    })
    .max(30, {
      error: "Lote deve ter no máximo 30 caracteres",
    }),
  validityDate: z
    .string()
    .trim()
    .min(2, {
      error: "Selecione um produto",
    })
    .max(30, {
      error: "Lote deve ter no máximo 30 caracteres",
    }),
  productQuantity: z
    .string()
    .trim()
    .min(1, {
      error: "Selecione um produto",
    })
    .max(10, {
      error: "Quantidade deve ter no máximo 10 caracteres",
    })
    .refine(
      (v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0;
      },
      {
        error: "Número inválido. Use apenas números positivos maiores que 0.",
      }
    ),
  productUnit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
    error: (issue) => {
      if (issue.input === undefined) {
        return { message: `Selecione um produto.` };
      }
      if (issue.code === "invalid_value") {
        return { message: `Selecione um produto.` };
      }

      return "Inválido.";
    },
  }),

  quantity: z
    .string()
    .trim()
    .min(1, {
      error: "Quantidade é obrigatória",
    })
    .max(10, {
      error: "Quantidade deve ter no máximo 10 caracteres",
    })
    .refine(
      (v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0;
      },
      {
        error: "Número inválido. Use apenas números positivos maiores que 0.",
      }
    ),
  unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
    error: (issue) => {
      if (issue.input === undefined) {
        return { message: `Selecione uma unidade de medida.` };
      }
      if (issue.code === "invalid_value") {
        return { message: `Selecione uma unidade de medida.` };
      }

      return "Inválido.";
    },
  }),
  movementCategory: z.enum(
    [
      AdjustmentMovementCategoryType.DUE_DATE,
      AdjustmentMovementCategoryType.CORRECTION,
      AdjustmentMovementCategoryType.GENERAL,
      AdjustmentMovementCategoryType.LOSS_DAMAGE,
      AdjustmentMovementCategoryType.THEFT_MISPLACEMENT,
    ],
    {
      error: (issue) => {
        if (issue.input === undefined) {
          return { message: `Selecione uma categoria de ajuste.` };
        }
        if (issue.code === "invalid_value") {
          return { message: `Selecione uma categoria de ajuste.` };
        }

        return "Inválido.";
      },
    }
  ),
  adjustmentType: z.enum([AdjustmentType.POSITIVE, AdjustmentType.NEGATIVE], {
    error: (issue) => {
      if (issue.input === undefined) {
        return { message: `Selecione o tipo de ajuste.` };
      }
      if (issue.code === "invalid_value") {
        return { message: `Selecione o tipo de ajuste.` };
      }

      return "Inválido.";
    },
  }),
});
