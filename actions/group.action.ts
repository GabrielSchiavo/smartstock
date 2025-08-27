"use server";

import { revalidatePath } from "next/cache";
import {
  type GroupResponse,
  type SingleGroupResponse,
  type CheckGroupResponse,
  ActionType,
  EntityType,
} from "@/types";
import { auditLogRepository, groupRepository } from "@/db";
import { currentUser } from "@/lib/auth";

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
  const user = await currentUser();

  if (!trimmedName) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newGroup = await groupRepository.create(trimmedName);

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: newGroup.id,
      actionType: ActionType.CREATE,
      entity: EntityType.GROUP,
      value: newGroup.name as string,
      observation: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.GROUP}' | Record Changed ID='${newGroup.id}' | Changed Value='${newGroup.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

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
  const user = await currentUser();

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

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: existingGroup.id,
      actionType: ActionType.DELETE,
      entity: EntityType.GROUP,
      value: existingGroup.name,
      observation: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.GROUP}' | Record Changed ID='${existingGroup.id}' | Changed Value='${existingGroup.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

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
