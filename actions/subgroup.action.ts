"use server";

import { revalidatePath } from "next/cache";
import { subgroupRepository } from "@/db";
import {
  CheckSubgroupResponse,
  SingleSubgroupResponse,
  SubgroupOperationResponse,
  SubgroupResponse,
} from "@/types";

export const getAllSubgroup = async (): Promise<SubgroupResponse> => {
  try {
    const subgroups = await subgroupRepository.findAll();
    return {
      success: true,
      title: "Sucesso!",
      description: "Subgrupo carregados com sucesso.",
      data: subgroups,
    };
  } catch (error) {
    console.error("Erro ao buscar Subgrupos:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao acessar a lista de subgrupos.",
    };
  }
};

export const searchSubgroup = async (
  query: string
): Promise<SubgroupResponse> => {
  if (!query) return { success: true, data: [] };

  try {
    const subgroups = await subgroupRepository.search(query);
    return {
      success: true,
      data: subgroups,
      title: "Sucesso!",
      description: "Subgrupos encontrados com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao buscar Subgrupos:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao pesquisar subgrupos.",
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
      title: "Erro!",
      description: "O campo não pode estar vazio.",
    };
  }

  try {
    const newSubgroup = await subgroupRepository.create(name);
    revalidatePath("/");
    return {
      success: true,
      data: newSubgroup,
      title: "Sucesso!",
      description: "Subgrupo criado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao criar Subgrupo:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao criar subgrupo.",
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
        title: "Erro!",
        description: "Subgrupo não encontrado.",
      };
    }

    await subgroupRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Subgrupo excluído com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir Subgrupo:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao excluir subgrupo.",
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
      success: false,
      title: "Aviso!",
      description: "Este subgrupo está associado a um ou mais produtos.",
    };
  } catch (error) {
    console.error("Erro ao verificar produtos associados:", error);
    return {
      isUsed: true,
      success: false,
      title: "Erro!",
      description: "Erro ao verificar produtos associados.",
    };
  }
};
