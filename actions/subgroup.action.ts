"use server";

import { auditLogRepository, subgroupRepository } from "@/db";
import {
  EntityType,
  ActionType,
  CheckSubgroupResponse,
  SingleSubgroupResponse,
  SubgroupOperationResponse,
  SubgroupResponse,
} from "@/types";
import { currentUser } from "@/utils/current-session-utils";
import { db } from "@/lib/db";
import { getIpAddress } from "@/utils/ip-address-utils";

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
  const user = await currentUser();

  // Validação de entrada
  if (!name.trim()) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo não pode estar vazio.",
    };
  }

  try {
    const newSubgroup = await db.$transaction(async (tx) => {
      const newSubgroup = await subgroupRepository.create(name, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: newSubgroup.id,
          actionType: ActionType.CREATE,
          entity: EntityType.SUBGROUP,
          changedValue: newSubgroup.name,
          ipAddress: await getIpAddress(),
          details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.SUBGROUP}' | Record Changed ID='${newSubgroup.id}' | Changed Value='${newSubgroup.name}' | User ID='${user?.id}' | User='${user?.name}' | IP Address='${await getIpAddress()}' | Message='Subgroup '${newSubgroup.name}' Created' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );

      return newSubgroup;
    });

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
  const user = await currentUser();

  try {
    const existingSubgroup = await subgroupRepository.findById(id);

    if (!existingSubgroup) {
      return {
        success: false,
        title: "Erro!",
        description: "Subgrupo não encontrado.",
      };
    }

    await db.$transaction(async (tx) => {
      await subgroupRepository.delete(id, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: existingSubgroup.id,
          actionType: ActionType.DELETE,
          entity: EntityType.SUBGROUP,
          changedValue: existingSubgroup.name,
          ipAddress: await getIpAddress(),
          details: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.SUBGROUP}' | Record Changed ID='${existingSubgroup.id}' | Changed Value='${existingSubgroup.name}' | User ID='${user?.id}' | User='${user?.name}' | IP Address='${await getIpAddress()}' | Message='Subgroup ${existingSubgroup.name} Excluded' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );
    });

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
  subgroupId: string
): Promise<CheckSubgroupResponse> => {
  try {
    const productWithSubgroup =
      await subgroupRepository.checkInMasterProducts(subgroupId);

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
