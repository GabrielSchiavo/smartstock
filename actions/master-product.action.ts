"use server";

import { CreateEditMasterProductSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auditLogRepository, masterProductRepository } from "@/db";
import type { MasterProduct } from "@prisma/client";
import {
  EntityType,
  ActionType,
  MasterProductOperationResponse,
} from "@/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const registerMasterProduct = async (
  values: z.infer<typeof CreateEditMasterProductSchema>
): Promise<MasterProductOperationResponse> => {
  const validatedFields = CreateEditMasterProductSchema.safeParse(values);
  const user = await currentUser();

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { ...masterProductData } = validatedFields.data;

  try {
    await db.$transaction(async (tx) => {
      const masterProduct = await masterProductRepository.create(
        {
          ...masterProductData,
        },
        tx
      );

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: masterProduct.id.toString(),
          actionType: ActionType.CREATE,
          entity: EntityType.MASTER_PRODUCT,
          changedValue: masterProductData.name,
          details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.MASTER_PRODUCT}' | Record Changed ID='${masterProduct.id.toString()}' | Changed Value='${masterProduct.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );

      return masterProduct;
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
  const user = await currentUser();

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

    const updatedMasterProduct = await db.$transaction(async (tx) => {
      const updatedMasterProduct = await masterProductRepository.update(
        id,
        {
          ...masterProductData,
          updatedAt: new Date(),
        },
        tx
      );

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: updatedMasterProduct.id.toString(),
          actionType: ActionType.UPDATE,
          entity: EntityType.MASTER_PRODUCT,
          changedValue: masterProductData.name,
          details: `[AUDIT] Action='${ActionType.UPDATE}' | Entity='${EntityType.MASTER_PRODUCT}' | Record Changed ID='${updatedMasterProduct.id.toString()}' | Changed Value='${masterProductData.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );

      return updatedMasterProduct;
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
  const user = await currentUser();

  try {
    const existingMasterProduct = await masterProductRepository.findById(id);
    const productWithMasterProduct =
      await masterProductRepository.checkInProducts(id);

    if (!existingMasterProduct) {
      return {
        success: false,
        title: "Erro!",
        description: "Produto Mestre não encontrado.",
      };
    }
    if (!!productWithMasterProduct) {
      return {
        isUsed: !!productWithMasterProduct,
        success: false,
        title: "Aviso!",
        description:
          "Este produto mestre está associado a um ou mais produtos.",
      };
    }

    await db.$transaction(async (tx) => {
      await masterProductRepository.delete(id, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: existingMasterProduct.id.toString(),
          actionType: ActionType.DELETE,
          entity: EntityType.MASTER_PRODUCT,
          changedValue: existingMasterProduct.name,
          details: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.MASTER_PRODUCT}' | Record Changed ID='${existingMasterProduct.id.toString()}' | Changed Value='${existingMasterProduct.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: `Produto Mestre com ID ${id} excluído com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao excluir produto mestre:", error);
    return {
      isUsed: true,
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
