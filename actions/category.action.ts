"use server";

import { auditLogRepository, categoryRepository } from "@/db";
import { revalidatePath } from "next/cache";
import {
  type CategoryResponse,
  type SingleCategoryResponse,
  type CheckCategoryResponse,
  type CategoryCountResponse,
  ActionType,
  EntityType,
} from "@/types";
import { currentUser } from "@/lib/auth";

export async function getAllCategory(): Promise<CategoryResponse> {
  try {
    const categories = await categoryRepository.findAll();

    return {
      success: true,
      title: "Sucesso!",
      description: "Categorias carregados com sucesso.",
      data: categories,
    };
  } catch (error) {
    console.error("Erro ao buscar Categorias:", error);

    return {
      success: false,
      title: "Erro!",
      description: "Erro ao acessar a lista de categorias.",
    };
  }
}

export async function getCategoriesCount(): Promise<CategoryCountResponse> {
  try {
    const count = await categoryRepository.count();
    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error("Erro ao contar Categorias:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível contar os categorias.",
    };
  }
}

export async function searchCategory(query: string): Promise<CategoryResponse> {
  if (!query) return { success: true, data: [] };

  try {
    const categories = await categoryRepository.search(query);
    return {
      success: true,
      title: "Sucesso!",
      description: "Categorias encontrados com sucesso.",
      data: categories,
    };
  } catch (error) {
    console.error("Erro na busca por Categorias:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao pesquisar categorias.",
    };
  }
}

export async function createCategory(
  name: string
): Promise<SingleCategoryResponse> {
  const trimmedName = name.trim();
  const user = await currentUser();

  if (!trimmedName) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newCategory = await categoryRepository.create(trimmedName);

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: newCategory.id,
      actionType: ActionType.CREATE,
      entity: EntityType.CATEGORY,
      value: newCategory.name,
      observation: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.MASTER_PRODUCT}' | Record Changed ID='${newCategory.id}' | Changed Value='${newCategory.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Categoria criada com sucesso.",
      data: newCategory,
    };
  } catch (error) {
    console.error("Erro ao criar Categoria:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao criar categoria.",
    };
  }
}

export async function deleteCategory(id: string): Promise<CategoryResponse> {
  const user = await currentUser();

  try {
    const existingCategory = await categoryRepository.findById(id);

    if (!existingCategory) {
      return {
        success: false,
        title: "Erro!",
        description: "Categoria não encontrado.",
      };
    }

    await categoryRepository.delete(id);

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: existingCategory.id,
      actionType: ActionType.DELETE,
      entity: EntityType.CATEGORY,
      value: existingCategory.name,
      observation: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.CATEGORY}' | Record Changed ID='${existingCategory.id}' | Changed Value='${existingCategory.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Categoria excluído com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir Categoria:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao excluir categoria.",
    };
  }
}

export async function checkCategoryUsage(
  categoryName: string
): Promise<CheckCategoryResponse> {
  try {
    const productWithCategory =
      await categoryRepository.checkCategoryUsage(categoryName);

    return {
      isUsed: !!productWithCategory,
      success: false,
      title: "Aviso!",
      description: "Este categoria está associado a um ou mais produtos.",
    };
  } catch (error) {
    console.error("Erro ao verificar produtos associados", error);
    return {
      isUsed: true,
      success: false,
      title: "Erro!",
      description: "Erro ao verificar produtos associados.",
    };
  }
}
