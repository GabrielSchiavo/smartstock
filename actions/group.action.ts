"use server";

import { revalidatePath } from "next/cache";
import type {
  GroupResponse,
  SingleGroupResponse,
  CheckGroupResponse,
} from "@/types";
import { groupRepository } from "@/db";

// Implementações
export async function getAllGroup(): Promise<GroupResponse> {
  try {
    const groups = await groupRepository.findAll();
    return {
      success: true,
      title: "Sucesso!",
      description: "Grupos carregados com sucesso.",
      data: groups,
    };
  } catch (error) {
    console.error("Erro ao buscar Grupos:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível acessar a lista de grupos.",
    };
  }
}

export async function searchGroup(query: string): Promise<GroupResponse> {
  if (!query.trim()) return { success: true, data: [] };

  try {
    const groups = await groupRepository.search(query);
    return {
      success: true,
      title: "Sucesso!",
      description: "Grupos encontrados com sucesso.",
      data: groups,
    };
  } catch (error) {
    console.error("Erro ao pesquisar Grupos:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao pesquisar grupos.",
    };
  }
}

export async function createGroup(name: string): Promise<SingleGroupResponse> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newGroup = await groupRepository.create(trimmedName);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Grupo criado com sucesso.",
      data: newGroup,
    };
  } catch (error) {
    console.error("Erro ao criar Grupo:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao criar grupo.",
    };
  }
}

export async function deleteGroup(id: string): Promise<GroupResponse> {
  try {
    const existingGroup = await groupRepository.findById(id);

    if (!existingGroup) {
      return {
        success: false,
        title: "Erro!",
        description: "Grupo não encontrado.",
      };
    }

    await groupRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Grupo excluído com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir Grupo:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao excluir grupo.",
    };
  }
}

export async function checkGroupUsage(
  groupName: string
): Promise<CheckGroupResponse> {
  try {
    const productWithGroup = await groupRepository.checkInProducts(groupName);

    return {
      isUsed: !!productWithGroup,
      success: false,
      title: "Aviso!",
      description: "Este grupo está associado a um ou mais produtos.",
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
}
