"use server";

import { revalidatePath } from "next/cache";
import { subgroupRepository } from "@/db";
import {
  CheckSubgroupResponse,
  SingleSubgroupResponse,
  SubgroupOperationResponse,
  SubgroupResponse,
} from "@/types";

export const getAllSubgroups = async (): Promise<SubgroupResponse> => {
  try {
    const subgroups = await subgroupRepository.findAll();
    return {
      success: true,
      data: subgroups,
      message: "Subgrupos carregados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao buscar Subgrupos:", error);
    return {
      success: false,
      message: "Falha ao carregar subgrupos",
      error: "Erro ao acessar a lista de subgrupos",
    };
  }
};

export const searchSubgroups = async (
  query: string
): Promise<SubgroupResponse> => {
  if (!query) return { success: true, data: [] };

  try {
    const subgroups = await subgroupRepository.search(query);
    return {
      success: true,
      data: subgroups,
      message: "Subgrupos encontrados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao buscar Subgrupos:", error);
    return {
      success: false,
      message: "Falha na busca",
      error: "Erro ao pesquisar subgrupos",
    };
  }
};

export const createSubgroup = async (
  name: string
): Promise<SingleSubgroupResponse> => {
  // Validação de entrada
  if (!name.trim()) {
    return {
      success: false,
      message: "Dados inválidos",
      error: "O campo não pode estar vazio",
    };
  }

  try {
    const newSubgroup = await subgroupRepository.create(name);
    revalidatePath("/");
    return {
      success: true,
      data: newSubgroup,
      message: "Subgrupo criado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao criar Subgrupo:", error);
    return {
      success: false,
      message: "Falha ao criar subgrupo",
      error: "Subgrupo já existe ou nome inválido",
    };
  }
};

export const deleteSubgroup = async (
  id: string
): Promise<SubgroupOperationResponse> => {
  try {
    const existingSubgroup = await subgroupRepository.findById(id);

    if (!existingSubgroup) {
      return {
        success: false,
        message: "Subgrupo não encontrado",
        error: "O subgrupo solicitado não existe",
      };
    }

    await subgroupRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      message: "Subgrupo excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir Subgrupo:", error);
    return {
      success: false,
      message: "Falha ao excluir subgrupo",
      error: "Subgrupo não encontrado ou em uso",
    };
  }
};

export const checkSubgroupUsage = async (
  subgroupName: string
): Promise<CheckSubgroupResponse> => {
  try {
    const productWithSubgroup =
      await subgroupRepository.checkInProducts(subgroupName);

    return {
      isUsed: !!productWithSubgroup,
      message: productWithSubgroup
        ? "Este Subgrupo está associado a um ou mais produtos"
        : null,
    };
  } catch (error) {
    console.error("Erro ao verificar produtos associados:", error);
    return {
      isUsed: true,
      message: "Não foi possível verificar os produtos associados",
    };
  }
};
