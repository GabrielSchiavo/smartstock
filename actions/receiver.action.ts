"use server";

import { auditLogRepository, receiverRepository } from "@/db";
import {
  CheckReceiverResponse,
  SingleReceiverResponse,
  ReceiverOperationResponse,
  ReceiverResponse,
  ActionType,
  EntityType,
} from "@/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getAllReceiver = async (): Promise<ReceiverResponse> => {
  try {
    const receivers = await receiverRepository.findAll();
    return {
      success: true,
      title: "Sucesso!",
      description: "Recebedores carregados com sucesso.",
      data: receivers,
    };
  } catch (error) {
    console.error("Erro ao buscar Recebedores:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao acessar a lista de recebedores.",
    };
  }
};

export const searchReceiver = async (
  query: string
): Promise<ReceiverResponse> => {
  if (!query) return { success: true, data: [] };

  try {
    const receivers = await receiverRepository.search(query);
    return {
      success: true,
      title: "Sucesso!",
      description: "Recebedores encontrados com sucesso.",
      data: receivers,
    };
  } catch (error) {
    console.error("Erro ao buscar Recebedores:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao pesquisar recebedores.",
    };
  }
};

export const createReceiver = async (
  name: string
): Promise<SingleReceiverResponse> => {
  const user = await currentUser();

  if (!name.trim()) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newReceiver = await db.$transaction(async (tx) => {
      const newReceiver = await receiverRepository.create(name, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: newReceiver.id,
          actionType: ActionType.CREATE,
          entity: EntityType.RECEIVER,
          changedValue: newReceiver.name,
          details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.RECEIVER}' | Record Changed ID='${newReceiver.id}' | Changed Value='${newReceiver.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );

      return newReceiver;
    });

    return {
      success: true,
      data: newReceiver,
      title: "Sucesso!",
      description: "Recebedor criado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao criar Recebedor:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao criar recebedor.",
    };
  }
};

export const deleteReceiver = async (
  id: string
): Promise<ReceiverOperationResponse> => {
  const user = await currentUser();

  try {
    const existingReceiver = await receiverRepository.findById(id);

    if (!existingReceiver) {
      return {
        success: false,
        title: "Erro!",
        description: "Recebedor não encontrado.",
      };
    }

    await db.$transaction(async (tx) => {
      await receiverRepository.delete(id, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: existingReceiver.id,
          actionType: ActionType.DELETE,
          entity: EntityType.RECEIVER,
          changedValue: existingReceiver.name,
          details: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.RECEIVER}' | Record Changed ID='${existingReceiver.id}' | Changed Value='${existingReceiver.name}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );
    });

    return {
      success: true,
      title: "Sucesso!",
      description: "Recebedor excluído com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir Recebedor:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao excluir recebedor.",
    };
  }
};

export const checkReceiverUsage = async (
  receiverName: string
): Promise<CheckReceiverResponse> => {
  try {
    const productWithReceiver =
      await receiverRepository.checkInProducts(receiverName);

    return {
      isUsed: !!productWithReceiver,
      success: false,
      title: "Aviso!",
      description: "Este recebedor está associado a um ou mais produtos.",
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
