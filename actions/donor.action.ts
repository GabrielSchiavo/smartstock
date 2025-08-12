"use server";

import { donorRepository } from "@/db";
import { revalidatePath } from "next/cache";
import type {
  DonorResponse,
  SingleDonorResponse,
  CheckDonorResponse,
  DonorCountResponse,
} from "@/types";

export async function getAllDonor(): Promise<DonorResponse> {
  try {
    const donors = await donorRepository.findAll();

    return {
      success: true,
      title: "Sucesso!",
      description: "Doadores carregados com sucesso.",
      data: donors,
    };
  } catch (error) {
    console.error("Erro ao buscar Doadores:", error);

    return {
      success: false,
      title: "Erro!",
      description: "Erro ao acessar a lista de doadores.",
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
      title: "Erro!",
      description: "Não foi possível contar os doadores.",
    };
  }
}

export async function searchDonor(query: string): Promise<DonorResponse> {
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
      title: "Sucesso!",
      description: "Doadores encontrados com sucesso.",
      data: donors,
    };
  } catch (error) {
    console.error("Erro na busca por Doadores:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao pesquisar doadores.",
    };
  }
}

export async function createDonor(name: string): Promise<SingleDonorResponse> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      title: "Erro!",
      description: "O campo de não pode estar vazio.",
    };
  }

  try {
    const newDonor = await donorRepository.create(trimmedName);
    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Doador criado com sucesso.",
      data: newDonor,
    };
  } catch (error) {
    console.error("Erro ao criar Doador:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao criar doador.",
    };
  }
}

export async function deleteDonor(id: string): Promise<DonorResponse> {
  try {
    const existingDonor = await donorRepository.findById(id);

    if (!existingDonor) {
      return {
        success: false,
        title: "Erro!",
        description: "Doador não encontrado.",
      };
    }

    await donorRepository.delete(id);
    revalidatePath("/");

    return {
      success: true,
      title: "Sucesso!",
      description: "Doador excluído com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir Doador:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Erro ao excluir doador.",
    };
  }
}

export async function checkDonorUsage(
  donorName: string
): Promise<CheckDonorResponse> {
  try {
    const productWithDonor =
      await donorRepository.checkDonorUsage(donorName);

    return {
      isUsed: !!productWithDonor,
      success: false,
      title: "Aviso!",
      description: "Este doador está associado a um ou mais produtos.",
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
