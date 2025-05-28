'use server'

import { revalidatePath } from 'next/cache'
import { subgroupRepository } from '@/db'
import { CheckSubgroupResponse, SingleSubgroupResponse, SubgroupOperationResponse, SubgroupResponse } from '@/types'

export const createSubgroup = async (
  name: string
): Promise<SingleSubgroupResponse> => {
  // Validação de entrada
  if (!name.trim()) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do subgrupo não pode estar vazio'
    }
  }

  try {
    const newSubgroup = await subgroupRepository.create(name)
    revalidatePath('/')
    return { success: true, data: newSubgroup }
  } catch (error) {
    console.error('Erro ao criar subgrupo:', error)
    return {
      success: false,
      message: 'Falha ao criar',
      error: 'Subgrupo já existe ou falha na criação'
    }
  }
}

export const deleteSubgroup = async (
  id: string
): Promise<SubgroupOperationResponse> => {
  try {
    const existingSubgroup = await subgroupRepository.findById(id)

    if (!existingSubgroup) {
      return { 
        success: false, 
        message: 'Subgrupo não encontrado',
        error: 'O subgrupo solicitado não existe'
      }
    }

    await subgroupRepository.delete(id)
    revalidatePath('/')
    return { 
      success: true, 
      message: 'Subgrupo excluído com sucesso' 
    }
  } catch (error) {
    console.error('Erro ao excluir subgrupo:', error)
    return {
      success: false,
      message: 'Falha ao excluir subgrupo',
      error: 'Ocorreu um erro ao tentar excluir o subgrupo'
    }
  }
}

// ===== Operações de Consulta =====
export const getAllSubgroups = async (): Promise<SubgroupResponse> => {
  try {
    const subgroups = await subgroupRepository.findAll()
    return { success: true, data: subgroups }
  } catch (error) {
    console.error('Erro ao buscar subgrupos:', error)
    return {
      success: false,
      message: 'Falha ao carregar subgrupos',
      error: 'Não foi possível carregar a lista de subgrupos'
    }
  }
}

export const searchSubgroups = async (
  query: string
): Promise<SubgroupResponse> => {
  if (!query) return { success: true, data: [] }

  try {
    const subgroups = await subgroupRepository.search(query)
    return { success: true, data: subgroups }
  } catch (error) {
    console.error('Erro ao buscar subgrupos:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar subgrupos'
    }
  }
}

export const checkSubgroupUsage = async (
  subgroupName: string
): Promise<CheckSubgroupResponse> => {
  try {
    const productWithSubgroup = await subgroupRepository.checkInProducts(subgroupName)
    
    return {
      isUsed: !!productWithSubgroup,
      message: productWithSubgroup
        ? 'Este subgrupo está associado a um ou mais produtos'
        : null
    }
  } catch (error) {
    console.error('Erro ao verificar produtos associados:', error)
    return {
      isUsed: true,
      message: 'Não foi possível verificar os produtos associados'
    }
  }
}