"use server";

import { CreateProductSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import type { Product } from '@prisma/client'
import { revalidatePath } from "next/cache";

export const registerProduct = async (values: z.infer<typeof CreateProductSchema>) => {
    const validateFields = CreateProductSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"};
    }

    const { name, quantity, unit, lot, validityDate, donor, receiptDate, receiver, group, subgroup, productType } = validateFields.data;

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
            productType
        }
    });

    return { success: "Registration completed successfully!" };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
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
    console.error("Error deleting plant:", error);
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
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

export const editProduct = async (
  id: number,
  values: z.infer<typeof CreateProductSchema>
) => {
  // Validação dos campos
  const validateFields = CreateProductSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
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
    productType 
  } = validateFields.data;

  try {
    // Verifica se o produto existe
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { error: "Product not found!" };
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
      success: "Product updated successfully!", 
      product: updatedProduct 
    };
  } catch (error) {
    console.error("Error editing product:", error);
    return { error: "Failed to update product" };
  }
};