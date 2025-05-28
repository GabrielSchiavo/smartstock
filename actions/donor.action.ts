'use server'

import { donorRepository } from '@/db'
import { revalidatePath } from 'next/cache'
import type { 
  DonorResponse,
  SingleDonorResponse,
  CheckDonorResponse,
  DonorCountResponse,
} from '@/types'

export async function getAllDonors(): Promise<DonorResponse> {
  try {
    const donors = await donorRepository.findAll()
    return { 
      success: true, 
      data: donors 
    }
  } catch (error) {
    console.error('Erro ao buscar doadores:', error)
    return {
      success: false,
      message: 'Falha ao carregar doadores',
      error: 'Não foi possível carregar a lista de doadores'
    }
  }
}

export async function getDonorsCount(): Promise<DonorCountResponse> {
  try {
    const count = await donorRepository.count()
    return {
      success: true,
      count
    }
  } catch (error) {
    console.error("Erro ao contar doadores:", error)
    return {
      success: false,
      error: 'Falha ao contar doadores'
    }
  }
}

export async function searchDonors(query: string): Promise<DonorResponse> {
  if (!query) return { success: true, data: [] }

  try {
    const testRecord = await donorRepository.findByName('Anônimo')

    if (!testRecord) {
      await donorRepository.create('Anônimo')
      revalidatePath('/')
    }

    const donors = await donorRepository.search(query)
    return { 
      success: true, 
      data: donors 
    }
  } catch (error) {
    console.error('Erro na busca por doadores:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar doadores'
    }
  }
}

export async function createDonor(name: string): Promise<SingleDonorResponse> {
  const trimmedName = name.trim()
  
  if (!trimmedName) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do doador não pode estar vazio'
    }
  }

  try {
    const newDonor = await donorRepository.create(trimmedName)
    revalidatePath('/')
    return { 
      success: true, 
      data: newDonor,
      message: 'Doador criado com sucesso'
    }
  } catch (error) {
    console.error('Erro ao criar doador:', error)
    return {
      success: false,
      message: 'Falha na criação',
      error: 'Subgrupo já existe ou falha na criação'
    }
  }
}

export async function deleteDonor(id: string): Promise<DonorResponse> {
  try {
    const existingDonor = await donorRepository.findById(id)

    if (!existingDonor) {
      return { 
        success: false, 
        message: 'Subgrupo não encontrado' 
      }
    }

    await donorRepository.delete(id)
    revalidatePath('/')

    return { 
      success: true, 
      message: 'Subgrupo excluído com sucesso' 
    }
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
    const productWithDonor = await donorRepository.checkDonorInProducts(donorName)

    return {
      isUsed: !!productWithDonor,
      message: productWithDonor
        ? 'Este doador está associado a um ou mais produtos'
        : null
    }
  } catch (error) {
    console.error('Erro ao verificar produtos associados', error)
    return {
      isUsed: true,
      message: 'Não foi possível verificar se há produtos associados'
    }
  }
}