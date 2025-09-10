import { db } from "@/lib/db"
import { Prisma, Product, Receiver } from "@prisma/client"

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

  async create(name: string, tx?: Prisma.TransactionClient): Promise<Receiver> {
    const client = tx ?? db;

    return await client.receiver.create({
      data: { name },
    })
  },

  async findById(id: string): Promise<Receiver | null> {
    return await db.receiver.findUnique({
      where: { id },
    })
  },

  async delete(id: string,tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? db;

    await client.receiver.delete({
      where: { id },
    })
  },

  async checkInProducts(receiverId: string): Promise<Pick<Product, 'id'> | null> {
    return await db.product.findFirst({
      where: {
        receiverId: receiverId,
      },
      select: { id: true },
    })
  },
}