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
      data: receivers,
      message: "Recebedores carregados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao buscar Recebedores:", error);
    return {
      success: false,
      message: "Falha ao carregar recebedores",
      error: "Erro ao acessar a lista de recebedores",
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
      data: receivers,
      message: "Recebedores encontrados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao buscar Recebedores:", error);
    return {
      success: false,
      message: "Falha na busca",
      error: "Erro ao pesquisar recebedores",
    };
  }
};

export const createReceiver = async (
  name: string
): Promise<SingleReceiverResponse> => {
  if (!name.trim()) {
    return {
      success: false,
      message: "Dados inválidos",
      error: "O campo não pode estar vazio",
    };
  }

  try {
    const newReceiver = await receiverRepository.create(name);
    revalidatePath("/");
    return {
      success: true,
      data: newReceiver,
      message: "Recebedor criado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao criar Recebedor:", error);
    return {
      success: false,
      message: "Falha ao criar recebedor",
      error: "Recebedor já existe ou nome inválido",
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
        message: "Recebedor não encontrado",
        error: "O recebedor solicitado não existe",
      };
    }

    await receiverRepository.delete(id);
    revalidatePath("/");
    return {
      success: true,
      message: "Recebedor excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir Recebedor:", error);
    return {
      success: false,
      message: "Falha ao excluir recebedor",
      error: "Recebedor não encontrado ou em uso",
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
      message: productWithReceiver
        ? "Este Recebedor está associado a um ou mais produtos"
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
