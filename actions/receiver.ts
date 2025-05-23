'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Receiver } from '@prisma/client'

// Tipos
export type ReceiverResponse = {
  success: boolean
  data?: Receiver[]
  message?: string
  error?: string
}

export type SingleReceiverResponse = {
  success: boolean
  data?: Receiver
  message?: string
  error?: string
}

export type CheckReceiverResponse = {
  isUsed: boolean
  message: string | null
}

// Implementações individuais
export async function getAllReceivers(): Promise<ReceiverResponse> {
  try {
    const receivers = await db.receiver.findMany({
      orderBy: { name: 'asc' },
      take: 100,
    })
    return { success: true, data: receivers }
  } catch (error) {
    console.error('Erro ao buscar recebedores:', error)
    return {
      success: false,
      message: 'Falha ao carregar recebedores',
      error: 'Não foi possível carregar a lista de recebedores'
    }
  }
}

export async function searchReceivers(query: string): Promise<ReceiverResponse> {
  if (!query) return { success: true, data: [] }

  try {
    const receivers = await db.receiver.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
    })
    return { success: true, data: receivers }
  } catch (error) {
    console.error('Erro ao pesquisar recebedores:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar recebedores'
    }
  }
}

export async function createReceiver(name: string): Promise<SingleReceiverResponse> {
  if (!name.trim()) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do recebedor não pode estar vazio'
    }
  }

  try {
    const newReceiver = await db.receiver.create({
      data: { name },
    })
    revalidatePath('/')
    return { success: true, data: newReceiver }
  } catch (error) {
    console.error('Erro ao criar recebedor:', error)
    return {
      success: false,
      message: 'Falha ao criar',
      error: 'Subgrupo já existe ou falha na criação'
    }
  }
}

export async function deleteReceiver(id: string): Promise<Omit<ReceiverResponse, 'data'>> {
  try {
    const existingReceiver = await db.receiver.findUnique({
      where: { id }
    })

    if (!existingReceiver) {
      return { success: false, message: 'Recebedor não encontrado' }
    }

    await db.receiver.delete({
      where: { id }
    })

    return { success: true, message: 'Recebedor excluído com sucesso' }
  } catch (error) {
    console.error('Erro ao excluir o recebedor:', error)
    return {
      success: false,
      message: 'Falha ao excluir recebedor',
      error: 'Ocorreu um erro ao tentar excluir o recebedor'
    }
  }
}

export async function checkReceiverInProducts(receiverName: string): Promise<CheckReceiverResponse> {
  try {
    const productWithReceiver = await db.product.findFirst({
      where: {
        receiver: receiverName
      },
      select: { id: true }
    })

    return {
      isUsed: !!productWithReceiver,
      message: productWithReceiver
        ? 'Este recebedor está associada a um ou mais produtos'
        : null
    }
  } catch (error) {
    console.error('Erro verificar se há produtos associados:', error)
    return {
      isUsed: true,
      message: 'Não foi possível verificar se há produtos associados'
    }
  }
}