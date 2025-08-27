"use server";

import { CreateEditProductSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  auditLogRepository,
  productRepository,
} from "@/db";
import {
  EntityType,
  ActionType,
  ProductCountType,
  ProductOperationResponse,
  ProductWithMasterProductResponse,
} from "@/types";
import { currentUser } from "@/lib/auth";

export const editProduct = async (
  id: number,
  values: z.infer<typeof CreateEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateEditProductSchema.safeParse(values);
  const user = await currentUser();

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
      unitWeight: unitWeight ? Number(unitWeight) : null,
      masterProductId: Number(productData.masterProductId),
      updatedAt: new Date(),
    });

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: updatedProduct.id.toString(),
      actionType: ActionType.UPDATE,
      entity: EntityType.PRODUCT,
      value: `${updatedProduct.quantity.toString()} ${updatedProduct.unit}`,
      observation: `[AUDIT] Action='${ActionType.UPDATE}' | Entity='${EntityType.PRODUCT}' | Record Changed ID='${updatedProduct.id}' | Changed Value='${updatedProduct.quantity.toString()} ${updatedProduct.unit}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
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
  const user = await currentUser();

  try {
    await productRepository.delete(id);

    const product = await productRepository.findById(id)

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: id.toString(),
      actionType: ActionType.DELETE,
      entity: EntityType.PRODUCT,
      value: product?.name as string,
      observation: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.PRODUCT}' | Record Changed ID='${id.toString()}' | Changed Value='${product?.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

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

export const getProductById = async (
  id: number
): Promise<ProductWithMasterProductResponse> => {
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

export const getProducts = async (): Promise<
  ProductWithMasterProductResponse[]
> => {
  try {
    return await productRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export async function getProductsCount(
  type: ProductCountType = ProductCountType.ALL
) {
  try {
    const count = await productRepository.countProducts(type);

    return {
      success: true,
      title: "Sucesso!",
      description: "Contagem bem-sucedida.",
      count,
    };
  } catch (error) {
    console.error("Erro ao contar produtos (%s):", type, error);

    return {
      success: false,
      title: "Erro!",
      description: "Erro na contagem.",
    };
  }
}

export const getExpiredProducts = async (): Promise<
  ProductWithMasterProductResponse[]
> => {
  try {
    return await productRepository.findExpired();
  } catch (error) {
    console.error("Erro ao buscar produtos expirados:", error);
    throw error;
  }
};

export const getProductsToExpire = async (): Promise<
  ProductWithMasterProductResponse[]
> => {
  try {
    return await productRepository.findAboutToExpire();
  } catch (error) {
    console.error("Erro ao buscar produtos próximos a expirar:", error);
    throw error;
  }
};
