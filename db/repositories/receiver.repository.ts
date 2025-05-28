import { db } from "@/lib/db"
import { Product, Receiver } from "@prisma/client"

export const receiverRepository = {
  async findAll(take = 100): Promise<Receiver[]> {
    return await db.receiver.findMany({
      orderBy: { name: 'asc' },
      take,
    })
  },

  async search(query: string, take = 10): Promise<Receiver[]> {
    return await db.receiver.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take,
    })
  },

  async create(name: string): Promise<Receiver> {
    return await db.receiver.create({
      data: { name },
    })
  },

  async findById(id: string): Promise<Receiver | null> {
    return await db.receiver.findUnique({
      where: { id },
    })
  },

  async delete(id: string): Promise<void> {
    await db.receiver.delete({
      where: { id },
    })
  },

  async checkInProducts(receiverName: string): Promise<Pick<Product, 'id'> | null> {
    return await db.product.findFirst({
      where: {
        receiver: receiverName,
      },
      select: { id: true },
    })
  },
}