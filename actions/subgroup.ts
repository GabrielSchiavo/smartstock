'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Subgroup } from '@prisma/client'

// Tipos
export type SubgroupResponse = {
  success: boolean
  data?: Subgroup[]
  message?: string
  error?: string
}

export type SingleSubgroupResponse = {
  success: boolean
  data?: Subgroup
  message?: string
  error?: string
}

export type CheckSubgroupResponse = {
  isUsed: boolean
  message: string | null
}

// Implementações individuais
export async function getAllSubgroups(): Promise<SubgroupResponse> {
  try {
    const subgroups = await db.subgroup.findMany({
      orderBy: { name: 'asc' },
      take: 100,
    })
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

export async function searchSubgroups(query: string): Promise<SubgroupResponse> {
  if (!query) return { success: true, data: [] }

  try {
    const subgroups = await db.subgroup.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
    })
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

export async function createSubgroup(name: string): Promise<SingleSubgroupResponse> {
  if (!name.trim()) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do subgrupo não pode estar vazio'
    }
  }

  try {
    const newSubgroup = await db.subgroup.create({
      data: { name },
    })
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

export async function deleteSubgroup(id: string): Promise<Omit<SubgroupResponse, 'data'>> {
  try {
    const existingSubgroup = await db.subgroup.findUnique({
      where: { id }
    })

    if (!existingSubgroup) {
      return { success: false, message: 'Subgrupo não encontrado' }
    }

    await db.subgroup.delete({
      where: { id }
    })

    return { success: true, message: 'Subgrupo excluído com sucesso' }
  } catch (error) {
    console.error('Erro ao excluir subgrupo:', error)
    return {
      success: false,
      message: 'Falha ao excluir subgrupo',
      error: 'Ocorreu um erro ao tentar excluir o subgrupo'
    }
  }
}

export async function checkSubgroupInProducts(subgroupName: string): Promise<CheckSubgroupResponse> {
  try {
    const productWithSubgroup = await db.product.findFirst({
      where: {
        subgroup: subgroupName
      },
      select: { id: true }
    })

    return {
      isUsed: !!productWithSubgroup,
      message: productWithSubgroup
        ? 'Este subgrupo está associada a um ou mais produtos'
        : null
    }
  } catch (error) {
    console.error('Erro ao verificar se há produtos associados:', error)
    return {
      isUsed: true,
      message: 'Não foi possível verificar se há produtos associados'
    }
  }
}