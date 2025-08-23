import { z } from "zod";
import { InputMovementCategoryType, ProductType, UnitType } from "@/types";

export const CreateEditProductSchema = z
  .object({
    masterProductId: z
      .string()
      .trim()
      .min(1, {
          error: "Produto Mestre é obrigatório"
    }),
    name: z
      .string()
      .trim()
      .min(2, {
          error: "Nome é obrigatório"
    })
      .max(60, {
          error: "Nome deve ter no máximo 60 caracteres"
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
        error: (issue) => issue.input === undefined ? "Você precisa selecionar uma unidade de medida." : undefined
    }),
    unitWeight: z
      .string()
      .trim()
      .max(10, {
          error: "Peso Unitário deve ter no máximo 10 caracteres"
    })
      .refine(
        (v) => {
          if (v === undefined || v === "") return true;
          const n = Number(v);
          return !isNaN(n) && n > 0;
        },
        {
            error: "Número inválido. Use apenas números positivos maiores que 0."
        }
      )
      .optional(),
    unitOfUnitWeight: z
      .enum([UnitType.KG, UnitType.G, UnitType.L], {
          error: (issue) => issue.input === undefined ? "Você precisa selecionar uma unidade de medida." : undefined
    })
      .nullable()
      .optional(),
    lot: z
      .string()
      .trim()
      .min(2, {
          error: "Lote é obrigatório"
    })
      .max(30, {
          error: "Lote deve ter no máximo 30 caracteres"
    }),
    validityDate: z.date({
      error: "Selecione uma data"
    }),
    receiptDate: z.date({
      error: "Selecione uma data."
    }),
    receiver: z
      .string()
      .trim()
      .min(2, {
          error: "Recebedor é obrigatório"
    })
      .max(30, {
          error: "Recebedor deve ter no máximo 30 caracteres"
    }),
    category: z
      .string()
      .trim()
      .min(2, {
          error: "Selecione um produto mestre"
    })
      .max(50, {
          error: "Categoria deve ter no máximo 50 caracteres"
    }),
    group: z
      .string()
      .trim()
      .min(2, {
          error: "Selecione um produto mestre"
    })
      .max(50, {
          error: "Grupo deve ter no máximo 50 caracteres"
    }),
    subgroup: z
      .string()
      .trim()
      .min(2, {
          error: "Selecione um produto mestre"
    })
      .max(50, {
          error: "Subgrupo deve ter no máximo 50 caracteres"
    })
      .or(z.literal(""))
      .optional(),
    productType: z.enum([ProductType.DONATED, ProductType.PURCHASED], {
        error: (issue) => issue.input === undefined ? "Selecione um tipo de produto." : undefined
    }),
    supplier: z
      .string()
      .trim()
      .min(2, {
          error: "Fornecedor é obrigatório"
    })
      .max(30, {
          error: "Fornecedor deve ter no máximo 30 caracteres"
    })
      .nullable()
      .optional(),
    movementCategory: z.enum(
      [
        InputMovementCategoryType.DONATION,
        InputMovementCategoryType.PURCHASE,
        InputMovementCategoryType.RETURN,
        InputMovementCategoryType.TRANSFER,
        ""
      ],
      {
          error: (issue) => issue.input === undefined ? "Selecione o tipo de entrada." : undefined
    }
    ),
  })
  .refine(
    (data) => !(data.productType === ProductType.DONATED && !data.supplier),
    {
      path: ["supplier"],
        error: "Fornecedor é obrigatório para produtos doados."
    }
  );
