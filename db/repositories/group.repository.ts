import { db } from "@/lib/db"
import { Group, Product } from "@prisma/client"

export const groupRepository = {
  async findAll(take = 100): Promise<Group[]> {
    return await db.group.findMany({
      orderBy: { name: 'asc' },
      take,
    })
  },

  async search(query: string, take = 10): Promise<Group[]> {
    return await db.group.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take,
    })
  },

  async create(name: string): Promise<Group> {
    return await db.group.create({
      data: { name },
    })
  },

  async findById(id: string): Promise<Group | null> {
    return await db.group.findUnique({
      where: { id },
    })
  },

  async delete(id: string): Promise<void> {
    await db.group.delete({
      where: { id },
    })
  },

  async checkInProducts(groupName: string): Promise<Pick<Product, 'id'> | null> {
    return await db.product.findFirst({
      where: {
        masterProduct: {
          group: groupName,
        },
      },
      select: { id: true },
    })
  },
}