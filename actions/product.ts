"use server";

import { CreateEditProductSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import type { Product } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const registerProduct = async (
  values: z.infer<typeof CreateEditProductSchema>
) => {
  const validateFields = CreateEditProductSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos inválidos!" };
  }

  const {
    name,
    quantity,
    unit,
    lot,
    validityDate,
    donor,
    receiptDate,
    receiver,
    group,
    subgroup,
    productType,
  } = validateFields.data;

  const convertNumber = Number(quantity);

  await db.product.create({
    data: {
      name,
      quantity: convertNumber,
      unit,
      lot,
      validityDate,
      donor,
      receiptDate,
      receiver,
      group,
      subgroup,
      productType,
    },
  });

  return { success: "Cadastro concluído com sucesso!" };
};

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await db.product.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}
export async function getProductsCount() {
  try {
    const productsCount = await db.product.count();
    return productsCount;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

export async function getExpiredProducts(): Promise<Product[]> {
  try {
    const currentDate = new Date();
    const productsExpired = await db.product.findMany({
      where: {
        validityDate: {
          lt: currentDate,
        },
      },
      orderBy: {
        validityDate: 'asc'
      },
    });
    return productsExpired;
  } catch (error) {
    console.error("Erro ao buscar produtos expirados:", error);
    throw error;
  }
}
export async function getExpiredProductsCount() {
  try {
    const currentDate = new Date();
    const productsExpiredCount = await db.product.count({
      where: {
        validityDate: {
          lt: currentDate,
        },
      },
    });
    return productsExpiredCount;
  } catch (error) {
    console.error("Erro ao buscar produtos expirados:", error);
    throw error;
  }
}
export async function getProductsToExpire(): Promise<Product[]> {
  try {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 30); // 30 dias no futuro

    const productsToExpire = await db.product.findMany({
      where: {
        validityDate: {
          lt: limitDate,
          gte: new Date(), // gte = greater than or equal (maior ou igual)
        },
      },
      orderBy: {
        validityDate: 'asc'
      },
    });

    return productsToExpire;
  } catch (error) {
    console.error("Erro ao buscar produtos prestes a expirar:", error);
    throw error;
  }
}
export async function getProductsToExpireCount() {
  try {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 30); // 30 dias no futuro

    const productsToExpireCount = await db.product.count({
      where: {
        validityDate: {
          lt: limitDate,
          gte: new Date(), // gte = greater than or equal (maior ou igual)
        },
      },
    });

    return productsToExpireCount;
  } catch (error) {
    console.error("Erro ao buscar produtos prestes a expirar:", error);
    throw error;
  }
}


export async function deleteProduct(
  id: number //identify which plant we are editing
) {
  try {
    const deletedProduct = await db.product.delete({
      where: { id },
    });
    revalidatePath("/");
    return deletedProduct;
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
}

export const getProductById = async (id: number) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Falha ao buscar produto");
  }
};

export const editProduct = async (
  id: number,
  values: z.infer<typeof CreateEditProductSchema>
) => {
  // Validação dos campos
  const validateFields = CreateEditProductSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos inválidos!" };
  }

  const {
    name,
    quantity,
    unit,
    lot,
    validityDate,
    donor,
    receiptDate,
    receiver,
    group,
    subgroup,
    productType,
  } = validateFields.data;

  try {
    // Verifica se o produto existe
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { error: "Produto não encontrado!" };
    }

    // Atualiza o produto
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name,
        quantity: Number(quantity),
        unit,
        lot,
        validityDate,
        donor,
        receiptDate,
        receiver,
        group,
        subgroup,
        productType,
        updatedAt: new Date(),
      },
    });

    // Revalida os caminhos relevantes
    revalidatePath("/");

    return {
      success: "Produto atualizado com sucesso!",
      product: updatedProduct,
    };
  } catch (error) {
    console.error("Erro ao editar o produto:", error);
    return { error: "Falha ao atualizar o produto" };
  }
};
