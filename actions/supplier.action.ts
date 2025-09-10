"use server";

import { auditLogRepository, supplierRepository } from "@/db";
import { revalidatePath } from "next/cache";
import {
  type SupplierResponse,
  type SingleSupplierResponse,
  type CheckSupplierResponse,
  type SupplierCountResponse,
  ActionType,
  EntityType,
} from "@/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getAllSupplier(): Promise<SupplierResponse> {
  try {
    const suppliers = await supplierRepository.findAll();

    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedores carregados com sucesso.",
      data: suppliers,
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

export async function getSuppliersCount(): Promise<SupplierCountResponse> {
  try {
    const count = await supplierRepository.count();
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

export async function searchSupplier(query: string): Promise<SupplierResponse> {
  if (!query) return { success: true, data: [] };

  try {
    const defaultRecord = await supplierRepository.findByName("Anônimo");

    if (!defaultRecord) {
      await supplierRepository.create("Anônimo");
      revalidatePath("/");
    }

    const suppliers = await supplierRepository.search(query);
    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedores encontrados com sucesso.",
      data: suppliers,
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

export async function createSupplier(
  name: string
): Promise<SingleSupplierResponse> {
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
    const newSupplier = await db.$transaction(async (tx) => {
      const newSupplier = await supplierRepository.create(trimmedName, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: newSupplier.id,
          actionType: ActionType.CREATE,
          entity: EntityType.SUPPLIER,
          changedValue: newSupplier.name,
          details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.SUPPLIER}' | Record Changed ID='${newSupplier.id}' | Changed Value='${newSupplier.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );

      return newSupplier;
    });

    return {
      success: true,
      title: "Sucesso!",
      description: "Fornecedor criado com sucesso.",
      data: newSupplier,
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

export async function deleteSupplier(id: string): Promise<SupplierResponse> {
  const user = await currentUser();

  try {
    const existingSupplier = await supplierRepository.findById(id);

    if (!existingSupplier) {
      return {
        success: false,
        title: "Erro!",
        description: "Fornecedor não encontrado.",
      };
    }

    await db.$transaction(async (tx) => {
      await supplierRepository.delete(id, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: existingSupplier.id,
          actionType: ActionType.DELETE,
          entity: EntityType.SUPPLIER,
          changedValue: existingSupplier.name,
          details: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.SUPPLIER}' | Record Changed ID='${existingSupplier.id}' | Changed Value='${existingSupplier.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );
    });

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

export async function checkSupplierUsage(
  supplierId: string
): Promise<CheckSupplierResponse> {
  try {
    const productWithSupplier =
      await supplierRepository.checkInProducts(supplierId);

    return {
      isUsed: !!productWithSupplier,
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
