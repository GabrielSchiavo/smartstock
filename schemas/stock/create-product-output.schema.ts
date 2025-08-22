import { z } from "zod";
import { OutputMovementCategoryType, UnitType } from "@/types";

export const CreateProductOutputSchema = z.object({
  productId: z.string().trim().min(1, { message: "Produto é obrigatório" }),
  lot: z
    .string()
    .trim()
    .min(2, { message: "Selecione um produto" })
    .max(30, { message: "Lote deve ter no máximo 30 caracteres" }),
  validityDate: z
    .string()
    .trim()
    .min(2, { message: "Selecione um produto" })
    .max(30, { message: "Lote deve ter no máximo 30 caracteres" }),
  productQuantity: z
    .string()
    .trim()
    .min(1, { message: "Selecione um produto" })
    .max(10, { message: "Quantidade deve ter no máximo 10 caracteres" })
    .refine(
      (v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0;
      },
      {
        message: "Número inválido. Use apenas números positivos maiores que 0.",
      }
    ),
  productUnit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
    required_error: "Selecione um produto",
  }),

  
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
        message: "Número inválido. Use apenas números positivos maiores que 0.",
      }
    ),
  unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
    required_error: "Você precisa selecionar uma unidade de medida.",
  }),
  movementCategory: z.enum(
    [
      OutputMovementCategoryType.DONATED,
      OutputMovementCategoryType.PURCHASED,
      OutputMovementCategoryType.TRANSFER,
    ],
    {
      required_error: "Selecione o tipo de entrada.",
    }
  ),
});
