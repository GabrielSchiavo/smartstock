import { z } from "zod";
import {
  BaseUnitType,
  InputMovementCategoryType,
  ProductType,
  UnitType,
} from "@/types";

export const CreateInputEditProductSchema = z
  .object({
    masterProductId: z.string().trim().min(1, {
      error: "Produto Mestre é obrigatório",
    }),
    name: z
      .string()
      .trim()
      .min(2, {
        error: "Nome é obrigatório",
      })
      .max(60, {
        error: "Nome deve ter no máximo 60 caracteres",
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
          return !isNaN(n) && n >= 0;
        },
        {
          error: "Número inválido. Use apenas números positivos maiores que 0.",
        }
      ),
    unit: z.enum([UnitType.KG, UnitType.G, UnitType.L, UnitType.UN], {
      error: (issue) => {
        if (issue.input === undefined) {
          return { message: `Selecione a unidade.` };
        }
        if (issue.code === "invalid_value") {
          return { message: `Selecione a unidade.` };
        }

        return "Inválido.";
      },
    }),
    unitWeight: z
      .string()
      .trim()
      .max(10, {
        error: "Peso Unitário deve ter no máximo 10 caracteres",
      })
      .refine(
        (v) => {
          if (v === undefined || v === "") return true;
          const n = Number(v);
          return !isNaN(n) && n > 0;
        },
        {
          error: "Número inválido. Use apenas números positivos maiores que 0.",
        }
      )
      .optional(),
    unitOfUnitWeight: z
      .enum([UnitType.KG, UnitType.G, UnitType.L], {
        error: (issue) => {
          if (issue.code === "invalid_value") {
            return { message: `Unidade inválida.` };
          }

          return "Inválido.";
        },
      })
      .nullable()
      .optional(),
    lot: z
      .string()
      .trim()
      .min(2, {
        error: "Lote é obrigatório",
      })
      .max(30, {
        error: "Lote deve ter no máximo 30 caracteres",
      }),
    validityDate: z.date({
      error: "Selecione uma data",
    }),
    receiptDate: z.date({
      error: "Selecione uma data.",
    }),
    receiverId: z.string().trim().min(2, {
      error: "Recebedor é obrigatório",
    }),
    category: z
      .string()
      .trim()
      .min(2, {
        error: "Selecione um produto mestre",
      })
      .max(50, {
        error: "Categoria deve ter no máximo 50 caracteres",
      }),
    group: z
      .string()
      .trim()
      .min(2, {
        error: "Selecione um produto mestre",
      })
      .max(50, {
        error: "Grupo deve ter no máximo 50 caracteres",
      }),
    subgroup: z
      .string()
      .trim()
      .min(2, {
        error: "Selecione um produto mestre",
      })
      .max(50, {
        error: "Subgrupo deve ter no máximo 50 caracteres",
      })
      .or(z.literal(""))
      .optional(),
    baseUnit: z.enum([BaseUnitType.KG, BaseUnitType.L, BaseUnitType.UN], {
      error: "Selecione um produto mestre",
    }),
    productType: z.enum([ProductType.DONATED, ProductType.PURCHASED], {
      error: (issue) => {
        if (issue.input === undefined) {
          return { message: `Selecione o tipo do produto.` };
        }
        if (issue.code === "invalid_value") {
          return { message: `Selecione o tipo do produto.` };
        }

        return "Inválido.";
      },
    }),
    supplierId: z.string().trim().nullable().optional(),
    movementCategory: z.enum(InputMovementCategoryType,
      {
        error: (issue) => {
          if (issue.input === undefined) {
            return { message: `Selecione uma categoria de entrada.` };
          }
          if (issue.code === "invalid_value") {
            return { message: `Selecione uma categoria de entrada.` };
          }

          return "Inválido.";
        },
      }
    ),
  })
  .refine(
    (data) => {
      if (data.productType === ProductType.DONATED) {
        return !!data.supplierId;
      }
      return true;
    },
    {
      path: ["supplierId"],
      error: "Fornecedor é obrigatório para produtos doados.",
    }
  )
  .refine(
    (data) => {
      if (data.unit === UnitType.UN) {
        return !!data.unitWeight;
      }
      return true;
    },
    {
      path: ["unitWeight"],
      error: "Obrigatório para produtos com Unidade 'UN'.",
    }
  )
  .refine(
    (data) => {
      if (data.unit === UnitType.UN) {
        return !!data.unitOfUnitWeight;
      }
      return true;
    },
    {
      path: ["unitOfUnitWeight"],
      error: () => {
        return "Obrigatório para produtos com Unidade 'UN'.";
      },
    }
  );
