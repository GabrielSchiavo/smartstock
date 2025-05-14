'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Group } from '@prisma/client'

// Tipos
export type GroupResponse = {
  success: boolean
  data?: Group[]
  message?: string
  error?: string
}

export type SingleGroupResponse = {
  success: boolean
  data?: Group
  message?: string
  error?: string
}

export type CheckGroupResponse = {
  isUsed: boolean
  message: string | null
}

// Implementações individuais
export async function getAllGroups(): Promise<GroupResponse> {
  try {
    const groups = await db.group.findMany({
      orderBy: { name: 'asc' },
      take: 100,
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error('Error fetching grupos:', error)
    return {
      success: false,
      message: 'Falha ao carregar grupos',
      error: 'Não foi possível carregar a lista de grupos'
    }
  }
}

export async function searchGroups(query: string): Promise<GroupResponse> {
  if (!query) return { success: true, data: [] }

  try {
    const groups = await db.group.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error('Error searching grupos:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar grupos'
    }
  }
}

export async function createGroup(name: string): Promise<SingleGroupResponse> {
  if (!name.trim()) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do grupo não pode estar vazio'
    }
  }

  try {
    const newGroup = await db.group.create({
      data: { name },
    })
    revalidatePath('/')
    return { success: true, data: newGroup }
  } catch (error) {
    console.error('Error creating grupo:', error)
    return {
      success: false,
      message: 'Falha ao criar',
      error: 'Grupo já existe ou falha na criação'
    }
  }
}

export async function deleteGroup(id: string): Promise<Omit<GroupResponse, 'data'>> {
  try {
    const existingGroup = await db.group.findUnique({
      where: { id }
    })

    if (!existingGroup) {
      return { success: false, message: 'Grupo não encontrado' }
    }

    await db.group.delete({
      where: { id }
    })

    return { success: true, message: 'Grupo excluído com sucesso' }
  } catch (error) {
    console.error('Error deleting group:', error)
    return {
      success: false,
      message: 'Falha ao excluir grupo',
      error: 'Ocorreu um erro ao tentar excluir o grupo'
    }
  }
}

export async function checkGroupInProducts(groupName: string): Promise<CheckGroupResponse> {
  try {
    const productWithGroup = await db.product.findFirst({
      where: {
        group: groupName
      },
      select: { id: true }
    })

    return {
      isUsed: !!productWithGroup,
      message: productWithGroup
        ? 'Este grupo está associada a um ou mais produtos'
        : null
    }
  } catch (error) {
    console.error('Error checking grupo in products:', error)
    return {
      isUsed: true,
      message: 'Não foi possível verificar os produtos associados'
    }
  }
}