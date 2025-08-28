import { z } from "zod";
import { OutputMovementCategoryType, UnitType } from "@/types";

export const CreateOutputSchema = z.object({
  productId: z.string().trim().min(1, {
      error: "Produto é obrigatório"
}),
  lot: z
    .string()
    .trim()
    .min(2, {
        error: "Selecione um produto"
    })
    .max(30, {
        error: "Lote deve ter no máximo 30 caracteres"
    }),
  validityDate: z
    .string()
    .trim()
    .min(2, {
        error: "Selecione um produto"
    })
    .max(30, {
        error: "Lote deve ter no máximo 30 caracteres"
    }),
  productQuantity: z
    .string()
    .trim()
    .min(1, {
        error: "Selecione um produto"
    })
    .max(10, {
        error: "Quantidade deve ter no máximo 10 caracteres"
    })
    .refine(
      (v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0;
      },
      {
          error: "Número inválido. Use apenas números positivos maiores que 0."
    }
    ),
  productUnit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      error: "Selecione um produto"
}),

  
  quantity: z
    .string()
    .trim()
    .min(1, {
        error: "Quantidade é obrigatória"
    })
    .max(10, {
        error: "Quantidade deve ter no máximo 10 caracteres"
    })
    .refine(
      (v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0;
      },
      {
          error: "Número inválido. Use apenas números positivos maiores que 0."
    }
    ),
  unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      error: (issue) => issue.input === undefined ? "Selecione uma unidade de medida" : undefined
}),
  movementCategory: z.enum(
    [
      OutputMovementCategoryType.CONSUMPTION,
      OutputMovementCategoryType.DONATION,
      OutputMovementCategoryType.RETURN,
      OutputMovementCategoryType.SALE,
      OutputMovementCategoryType.TRANSFER,
    ],
    {
        error: (issue) => issue.input === undefined ? "Selecione a categoria de saída." : undefined
    }
  ),
});
