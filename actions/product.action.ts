"use server";

import { CreateEditProductSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { productRepository } from "@/db";
import type { Product } from "@prisma/client";
import { ProductCountType, ProductOperationResponse } from "@/types";

export const registerProduct = async (
  values: z.infer<typeof CreateEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateEditProductSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { quantity, unitWeight, ...productData } = validatedFields.data;

  try {
    await productRepository.create({
      ...productData,
      quantity: Number(quantity),
      unitWeight: Number(unitWeight),
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Produto cadastrado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível cadastrar o produto.",
    };
  }
};

export const editProduct = async (
  id: number,
  values: z.infer<typeof CreateEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateEditProductSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { quantity, unitWeight, ...productData } = validatedFields.data;

  try {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      return {
        success: false,
        title: "Erro!",
        description: "Produto não encontrado.",
      };
    }

    const updatedProduct = await productRepository.update(id, {
      ...productData,
      quantity: Number(quantity),
      unitWeight: Number(unitWeight),
      updatedAt: new Date(),
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Produto atualizado com sucesso!",
      product: updatedProduct,
    };
  } catch (error) {
    console.error("Erro ao editar o produto:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível atualizar o produto.",
    };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await productRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: `Produto com ID ${id} excluído com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível excluir o produto.",
    };
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    return product;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    return await productRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export async function getProductsCount(type: ProductCountType = ProductCountType.ALL) {
  try {
    const count = await productRepository.countProducts(type);

    return {
      success: true,
      title: "Sucesso!",
      description: "Contagem bem-sucedida.",
      count
    };
  } catch (error) {
    console.error(`Erro ao contar produtos (${type}):`, error);

    return {
      success: false,
      title: "Erro!",
      description: "Erro na contagem.",
    };
  }
}

export const getExpiredProducts = async (): Promise<Product[]> => {
  try {
    return await productRepository.findExpired();
  } catch (error) {
    console.error("Erro ao buscar produtos expirados:", error);
    throw error;
  }
};

export const getProductsToExpire = async (): Promise<Product[]> => {
  try {
    return await productRepository.findAboutToExpire();
  } catch (error) {
    console.error("Erro ao buscar produtos próximos a expirar:", error);
    throw error;
  }
};

