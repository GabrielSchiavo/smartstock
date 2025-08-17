"use server";

import { categoryRepository } from "@/db";
import { revalidatePath } from "next/cache";
import type {
  CategoryResponse,
  SingleCategoryResponse,
  CheckCategoryResponse,
  CategoryCountResponse,
} from "@/types";

export async function getAllCategory(): Promise<CategoryResponse> {
  try {
    const categorys = await categoryRepository.findAll();

    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedores carregados com sucesso.",
      data: categorys,
    };
  } catch (error) {
    console.error("Erro ao buscar Fornecedores:", error);

    return {
      success: false,
      title: "Erro!",
      description: "Erro ao acessar a lista de fornecedores.",
    };
  }
}

export async function getCategorysCount(): Promise<CategoryCountResponse> {
  try {
    const count = await categoryRepository.count();
    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error("Erro ao contar Fornecedores:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível contar os fornecedores.",
    };
  }
}

export async function searchCategory(query: string): Promise<CategoryResponse> {
  if (!query) return { success: true, data: [] };

  try {
    const testRecord = await categoryRepository.findByName("Anônimo");

    if (!testRecord) {
      await categoryRepository.create("Anônimo");
      revalidatePath("/");
    }

    const categorys = await categoryRepository.search(query);
    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedores encontrados com sucesso.",
      data: categorys,
    };
  } catch (error) {
    console.error("Erro na busca por Fornecedores:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao pesquisar fornecedores.",
    };
  }
}

export async function createCategory(name: string): Promise<SingleCategoryResponse> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newCategory = await categoryRepository.create(trimmedName);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedor criado com sucesso.",
      data: newCategory,
    };
  } catch (error) {
    console.error("Erro ao criar Fornecedor:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao criar fornecedor.",
    };
  }
}

export async function deleteCategory(id: string): Promise<CategoryResponse> {
  try {
    const existingCategory = await categoryRepository.findById(id);

    if (!existingCategory) {
      return {
        success: false,
        title: "Erro!",
        description: "Fornecedor não encontrado.",
      };
    }

    await categoryRepository.delete(id);
    revalidatePath("/");

    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedor excluído com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir Fornecedor:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao excluir fornecedor.",
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
      description: "Este fornecedor está associado a um ou mais produtos.",
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
