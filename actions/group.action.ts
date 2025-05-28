'use server'

import { revalidatePath } from 'next/cache'
import type {
  GroupResponse,
  SingleGroupResponse,
  CheckGroupResponse,
} from '@/types'
import { groupRepository } from '@/db'

// Implementações
export async function getAllGroups(): Promise<GroupResponse> {
  try {
    const groups = await groupRepository.findAll()
    return { 
      success: true, 
      data: groups,
      message: 'Grupos carregados com sucesso'
    }
  } catch (error) {
    console.error('Erro ao buscar grupos:', error)
    return {
      success: false,
      message: 'Falha ao carregar grupos',
      error: 'Não foi possível carregar a lista de grupos'
    }
  }
}

export async function searchGroups(query: string): Promise<GroupResponse> {
  if (!query.trim()) return { success: true, data: [] }

  try {
    const groups = await groupRepository.search(query)
    return { 
      success: true, 
      data: groups,
      message: 'Busca realizada com sucesso'
    }
  } catch (error) {
    console.error('Erro ao pesquisar grupos:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar grupos'
    }
  }
}

export async function createGroup(name: string): Promise<SingleGroupResponse> {
  const trimmedName = name.trim()
  
  if (!trimmedName) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do grupo não pode estar vazio'
    }
  }

  try {
    const newGroup = await groupRepository.create(trimmedName)
    revalidatePath('/')
    return { 
      success: true, 
      data: newGroup,
      message: 'Grupo criado com sucesso'
    }
  } catch (error) {
    console.error('Erro ao criar grupo:', error)
    return {
      success: false,
      message: 'Falha ao criar grupo',
      error: 'Grupo já existe ou falha na criação'
    }
  }
}

export async function deleteGroup(id: string): Promise<GroupResponse> {
  try {
    const existingGroup = await groupRepository.findById(id)

    if (!existingGroup) {
      return { 
        success: false, 
        message: 'Grupo não encontrado',
        error: 'O grupo especificado não existe'
      }
    }

    await groupRepository.delete(id)
    revalidatePath('/')
    return { 
      success: true, 
      message: 'Grupo excluído com sucesso'
    }
  } catch (error) {
    console.error('Erro ao excluir grupo:', error)
    return {
      success: false,
      message: 'Falha ao excluir grupo',
      error: 'Ocorreu um erro ao tentar excluir o grupo'
    }
  }
}

export async function checkGroupInProducts(groupName: string): Promise<CheckGroupResponse> {
  try {
    const productWithGroup = await groupRepository.checkInProducts(groupName)
    
    return {
      isUsed: !!productWithGroup,
      message: productWithGroup
        ? 'Este grupo está associado a um ou mais produtos'
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