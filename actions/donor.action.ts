"use server";

import { donorRepository } from "@/db";
import { revalidatePath } from "next/cache";
import type {
  DonorResponse,
  SingleDonorResponse,
  CheckDonorResponse,
  DonorCountResponse,
} from "@/types";

export async function getAllDonors(): Promise<DonorResponse> {
  try {
    const donors = await donorRepository.findAll();
    return {
      success: true,
      data: donors,
      message: "Doadores carregados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao buscar Doadores:", error);
    return {
      success: false,
      message: "Falha ao carregar doadores",
      error: "Erro ao acessar a lista de doadores",
    };
  }
}

export async function getDonorsCount(): Promise<DonorCountResponse> {
  try {
    const count = await donorRepository.count();
    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error("Erro ao contar Doadores:", error);
    return {
      success: false,
      error: "Não foi possível contar os doadores",
    };
  }
}

export async function searchDonors(query: string): Promise<DonorResponse> {
  if (!query) return { success: true, data: [] };

  try {
    const testRecord = await donorRepository.findByName("Anônimo");

    if (!testRecord) {
      await donorRepository.create("Anônimo");
      revalidatePath("/");
    }

    const donors = await donorRepository.search(query);
    return {
      success: true,
      message: "Doadores encontrados com sucesso",
      data: donors,
    };
  } catch (error) {
    console.error("Erro na busca por Doadores:", error);
    return {
      success: false,
      message: "Falha na busca",
      error: "Erro ao pesquisar doadores",
    };
  }
}

export async function createDonor(name: string): Promise<SingleDonorResponse> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      message: "Dados inválidos",
      error: "O campo não pode estar vazio",
    };
  }

  try {
    const newDonor = await donorRepository.create(trimmedName);
    revalidatePath("/");
    return {
      success: true,
      data: newDonor,
      message: "Doador criado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao criar Doador:", error);
    return {
      success: false,
      message: "Falha ao criar doador",
      error: "Doador já existe ou nome inválido",
    };
  }
}

export async function deleteDonor(id: string): Promise<DonorResponse> {
  try {
    const existingDonor = await donorRepository.findById(id);

    if (!existingDonor) {
      return {
        success: false,
        message: "Doador não encontrado",
        error: "O doador solicitado não existe",
      };
    }

    await donorRepository.delete(id);
    revalidatePath("/");

    return {
      success: true,
      message: "Doador excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir Doador:", error);
    return {
      success: false,
      message: "Falha ao excluir doador",
      error: "Doador não encontrado ou em uso",
    };
  }
}

export async function checkDonorInProducts(
  donorName: string
): Promise<CheckDonorResponse> {
  try {
    const productWithDonor =
      await donorRepository.checkDonorInProducts(donorName);

    return {
      isUsed: !!productWithDonor,
      message: productWithDonor
        ? "Este Doador está associado a um ou mais produtos"
        : null,
    };
  } catch (error) {
    console.error("Erro ao verificar produtos associados", error);
    return {
      isUsed: true,
      message: "Não foi possível verificar se há produtos associados",
    };
  }
}
