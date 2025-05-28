"use server";

import { CreateEditProductSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { productRepository } from "@/db";
import type { Product } from "@prisma/client";
import { ProductCountResponse, ProductOperationResponse } from "@/types";

export const registerProduct = async (
  values: z.infer<typeof CreateEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateEditProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { quantity, ...productData } = validatedFields.data;

  try {
    await productRepository.create({
      ...productData,
      quantity: Number(quantity),
    });
    
    revalidatePath("/");
    return { success: "Cadastro concluído com sucesso!" };
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return { error: "Falha ao cadastrar produto" };
  }
};

export const editProduct = async (
  id: number,
  values: z.infer<typeof CreateEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateEditProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { quantity, ...productData } = validatedFields.data;

  try {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      return { error: "Produto não encontrado!" };
    }

    const updatedProduct = await productRepository.update(id, {
      ...productData,
      quantity: Number(quantity),
      updatedAt: new Date(),
    });

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

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await productRepository.delete(id);
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
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
    throw new Error("Falha ao buscar produto");
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

export async function getProductsCount(): Promise<ProductCountResponse> {
  try {
    const count = await productRepository.count()
    return {
      success: true,
      count
    }
  } catch (error) {
    console.error("Erro ao contar doadores:", error)
    return {
      success: false,
      error: 'Falha ao contar doadores'
    }
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

export async function getExpiredProductsCount(): Promise<ProductCountResponse> {
  try {
    const count = await productRepository.countExpired()
    return {
      success: true,
      count
    }
  } catch (error) {
    console.error("Erro ao contar doadores:", error)
    return {
      success: false,
      error: 'Falha ao contar doadores'
    }
  }
}

export const getProductsToExpire = async (): Promise<Product[]> => {
  try {
    return await productRepository.findAboutToExpire();
  } catch (error) {
    console.error("Erro ao buscar produtos próximos a expirar:", error);
    throw error;
  }
};

export async function getProductsToExpireCount(): Promise<ProductCountResponse> {
  try {
    const count = await productRepository.countAboutToExpire()
    return {
      success: true,
      count
    }
  } catch (error) {
    console.error("Erro ao contar doadores:", error)
    return {
      success: false,
      error: 'Falha ao contar doadores'
    }
  }
}