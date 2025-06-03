"use server";

import { revalidatePath } from "next/cache";
import { receiverRepository } from "@/db";
import {
  CheckReceiverResponse,
  SingleReceiverResponse,
  ReceiverOperationResponse,
  ReceiverResponse,
} from "@/types";

export const getAllReceivers = async (): Promise<ReceiverResponse> => {
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

export const searchReceivers = async (
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
  if (!name.trim()) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newReceiver = await receiverRepository.create(name);
    revalidatePath("/");
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
  try {
    const existingReceiver = await receiverRepository.findById(id);

    if (!existingReceiver) {
      return {
        success: false,
        title: "Erro!",
        description: "Recebedor não encontrado.",
      };
    }

    await receiverRepository.delete(id);
    revalidatePath("/");
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
