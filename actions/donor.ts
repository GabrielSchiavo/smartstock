'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Donor } from '@prisma/client'

// Tipos
export type DonorResponse = {
  success: boolean
  data?: Donor[]
  message?: string
  error?: string
}

export type SingleDonorResponse = {
  success: boolean
  data?: Donor
  message?: string
  error?: string
}

export type CheckDonorResponse = {
  isUsed: boolean
  message: string | null
}

// Implementações individuais
export async function getAllDonors(): Promise<DonorResponse> {
  try {
    const donors = await db.donor.findMany({
      orderBy: { name: 'asc' },
      take: 100,
    })
    return { success: true, data: donors }
  } catch (error) {
    console.error('Erro ao buscar doadores:', error)
    return {
      success: false,
      message: 'Falha ao carregar doadores',
      error: 'Não foi possível carregar a lista de doadores'
    }
  }
}

export async function getDonorsCount() {
  try {
    const donorsCount = await db.donor.count();
    return donorsCount;
  } catch (error) {
    console.error("Erro ao buscar doadores:", error);
    throw error;
  }
}

export async function searchDonors(query: string): Promise<DonorResponse> {
  if (!query) return { success: true, data: [] }

  try {
    // Verificação universal (executa em qualquer busca)
    const testRecord = await db.donor.findFirst({
      where: { name: 'Anônimo' }
    });

    if (!testRecord) {
      await db.donor.create({
        data: { name: 'Anônimo' }
      });
      revalidatePath('/');
    }


    const donors = await db.donor.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
    })
    return { success: true, data: donors }


    
  } catch (error) {
    console.error('Erro ao buscar doadores:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar doadores'
    }
  }
}

export async function createDonor(name: string): Promise<SingleDonorResponse> {
  if (!name.trim()) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do doador não pode estar vazio'
    }
  }

  try {
    const newDonor = await db.donor.create({
      data: { name },
    })
    revalidatePath('/')
    return { success: true, data: newDonor }
  } catch (error) {
    console.error('Erro ao criar doador:', error)
    return {
      success: false,
      message: 'Falha ao criar',
      error: 'Subgrupo já existe ou falha na criação'
    }
  }
}

export async function deleteDonor(id: string): Promise<Omit<DonorResponse, 'data'>> {
  try {
    const existingDonor = await db.donor.findUnique({
      where: { id }
    })

    if (!existingDonor) {
      return { success: false, message: 'Subgrupo não encontrado' }
    }

    await db.donor.delete({
      where: { id }
    })

    return { success: true, message: 'Subgrupo excluído com sucesso' }
  } catch (error) {
    console.error('Erro ao excluir doador:', error)
    return {
      success: false,
      message: 'Falha ao excluir doador',
      error: 'Ocorreu um erro ao tentar excluir o doador'
    }
  }
}

export async function checkDonorInProducts(donorName: string): Promise<CheckDonorResponse> {
  try {
    const productWithDonor = await db.product.findFirst({
      where: {
        donor: donorName
      },
      select: { id: true }
    })

    return {
      isUsed: !!productWithDonor,
      message: productWithDonor
        ? 'Este doador está associada a um ou mais produtos'
        : null
    }
  } catch (error) {
    console.error('Erro ao verificar os produtos associados', error)
    return {
      isUsed: true,
      message: 'Não foi possível verificar se há produtos associados'
    }
  }
}