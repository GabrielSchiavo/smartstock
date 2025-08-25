"use server";

import { CreateEditMasterProductSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auditLogRepository, masterProductRepository } from "@/db";
import type { MasterProduct } from "@prisma/client";
import {
  ActionCategoryType,
  ActionType,
  MasterProductOperationResponse,
} from "@/types";
import { auth } from "@/auth";

export const registerMasterProduct = async (
  values: z.infer<typeof CreateEditMasterProductSchema>
): Promise<MasterProductOperationResponse> => {
  const session = await auth();

  const validatedFields = CreateEditMasterProductSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { ...masterProductData } = validatedFields.data;

  try {
    const masterProduct = await masterProductRepository.create({
      ...masterProductData,
    });

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: session?.user.id as string,
      recordChangedId: masterProduct.id.toString(),
      actionType: ActionType.CREATE,
      actionCategory: ActionCategoryType.MASTER_PRODUCT,
      value: masterProductData.name,
      observation: `CRIADO Produto Mestre: '${masterProductData.name}', por '${session?.user.name}'`,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Produto Mestre cadastrado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cadastrar produto mestre:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível cadastrar o produto mestre.",
    };
  }
};

export const editMasterProduct = async (
  id: number,
  values: z.infer<typeof CreateEditMasterProductSchema>
): Promise<MasterProductOperationResponse> => {
  const validatedFields = CreateEditMasterProductSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { ...masterProductData } = validatedFields.data;

  try {
    const existingMasterProduct = await masterProductRepository.findById(id);
    if (!existingMasterProduct) {
      return {
        success: false,
        title: "Erro!",
        description: "Produto Mestre não encontrado.",
      };
    }

    const updatedMasterProduct = await masterProductRepository.update(id, {
      ...masterProductData,
      updatedAt: new Date(),
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Produto Mestre atualizado com sucesso!",
      masterProduct: updatedMasterProduct,
    };
  } catch (error) {
    console.error("Erro ao editar o produto mestre:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível atualizar o produto mestre.",
    };
  }
};

export const deleteMasterProduct = async (id: number) => {
  try {
    await masterProductRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: `Produto Mestre com ID ${id} excluído com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao excluir produto mestre:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível excluir o produto mestre.",
    };
  }
};

export const getMasterProductById = async (
  id: number
): Promise<MasterProduct> => {
  try {
    const masterProduct = await masterProductRepository.findById(id);
    if (!masterProduct) {
      throw new Error("Produto Mestre não encontrado");
    }
    return masterProduct;
  } catch (error) {
    console.error("Erro ao buscar produto mestre:", error);
    throw new Error("Erro ao buscar produto mestre");
  }
};

export const getMasterProducts = async (): Promise<MasterProduct[]> => {
  try {
    return await masterProductRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar item mestres:", error);
    throw error;
  }
};
