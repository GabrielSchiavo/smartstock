"use server";

import { CreateEditMasterItemSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { masterItemRepository } from "@/db";
import type { MasterProduct } from "@prisma/client";
import { MasterItemOperationResponse } from "@/types";

export const registerMasterItem = async (
  values: z.infer<typeof CreateEditMasterItemSchema>
): Promise<MasterItemOperationResponse> => {
  const validatedFields = CreateEditMasterItemSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { ...masterItemData } = validatedFields.data;

  try {
    await masterItemRepository.create({
      ...masterItemData,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Item Mestre cadastrado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cadastrar item mestre:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível cadastrar o item mestre.",
    };
  }
};

export const editMasterItem = async (
  id: number,
  values: z.infer<typeof CreateEditMasterItemSchema>
): Promise<MasterItemOperationResponse> => {
  const validatedFields = CreateEditMasterItemSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { ...masterItemData } = validatedFields.data;

  try {
    const existingMasterItem = await masterItemRepository.findById(id);
    if (!existingMasterItem) {
      return {
        success: false,
        title: "Erro!",
        description: "Item Mestre não encontrado.",
      };
    }

    const updatedMasterItem = await masterItemRepository.update(id, {
      ...masterItemData,
      updatedAt: new Date(),
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Item Mestre atualizado com sucesso!",
      masterProduct: updatedMasterItem,
    };
  } catch (error) {
    console.error("Erro ao editar o item mestre:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível atualizar o item mestre.",
    };
  }
};

export const deleteMasterItem = async (id: number) => {
  try {
    await masterItemRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: `Item Mestre com ID ${id} excluído com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao excluir item mestre:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível excluir o item mestre.",
    };
  }
};

export const getMasterItemById = async (id: number): Promise<MasterProduct> => {
  try {
    const masterProduct = await masterItemRepository.findById(id);
    if (!masterProduct) {
      throw new Error("Item Mestre não encontrado");
    }
    return masterProduct;
  } catch (error) {
    console.error("Erro ao buscar item mestre:", error);
    throw new Error("Erro ao buscar item mestre");
  }
};

export const getMasterItems = async (): Promise<MasterProduct[]> => {
  try {
    return await masterItemRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar item mestres:", error);
    throw error;
  }
};
