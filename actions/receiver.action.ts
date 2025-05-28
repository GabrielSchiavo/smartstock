'use server'

import { revalidatePath } from 'next/cache'
import { receiverRepository } from '@/db'
import { CheckReceiverResponse, SingleReceiverResponse, ReceiverOperationResponse, ReceiverResponse } from '@/types'

export const createReceiver = async (
  name: string
): Promise<SingleReceiverResponse> => {
  if (!name.trim()) {
    return {
      success: false,
      message: 'Campo vazio',
      error: 'O nome do recebedor não pode estar vazio'
    }
  }

  try {
    const newReceiver = await receiverRepository.create(name)
    revalidatePath('/')
    return { success: true, data: newReceiver }
  } catch (error) {
    console.error('Erro ao criar recebedor:', error)
    return {
      success: false,
      message: 'Falha ao criar',
      error: 'Recebedor já existe ou falha na criação'
    }
  }
}

export const deleteReceiver = async (
  id: string
): Promise<ReceiverOperationResponse> => {
  try {
    const existingReceiver = await receiverRepository.findById(id)

    if (!existingReceiver) {
      return { 
        success: false, 
        message: 'Recebedor não encontrado',
        error: 'O recebedor solicitado não existe'
      }
    }

    await receiverRepository.delete(id)
    revalidatePath('/')
    return { 
      success: true, 
      message: 'Recebedor excluído com sucesso' 
    }
  } catch (error) {
    console.error('Erro ao excluir recebedor:', error)
    return {
      success: false,
      message: 'Falha ao excluir recebedor',
      error: 'Ocorreu um erro ao tentar excluir o recebedor'
    }
  }
}

// ===== Operações de Consulta =====
export const getAllReceivers = async (): Promise<ReceiverResponse> => {
  try {
    const receivers = await receiverRepository.findAll()
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

export const searchReceivers = async (
  query: string
): Promise<ReceiverResponse> => {
  if (!query) return { success: true, data: [] }

  try {
    const receivers = await receiverRepository.search(query)
    return { success: true, data: receivers }
  } catch (error) {
    console.error('Erro ao buscar recebedores:', error)
    return {
      success: false,
      message: 'Falha na busca',
      error: 'Ocorreu um erro ao buscar recebedores'
    }
  }
}

export const checkReceiverUsage = async (
  receiverName: string
): Promise<CheckReceiverResponse> => {
  try {
    const productWithReceiver = await receiverRepository.checkInProducts(receiverName)
    
    return {
      isUsed: !!productWithReceiver,
      message: productWithReceiver
        ? 'Este recebedor está associado a um ou mais produtos'
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