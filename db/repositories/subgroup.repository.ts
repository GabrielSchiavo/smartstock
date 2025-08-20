import { db } from "@/lib/db"
import { Product, Subgroup } from "@prisma/client"

export const subgroupRepository = {
  async findAll(take = 100): Promise<Subgroup[]> {
    return await db.subgroup.findMany({
      orderBy: { name: 'asc' },
      take,
    })
  },

  async search(query: string, take = 10): Promise<Subgroup[]> {
    return await db.subgroup.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take,
    })
  },

  async create(name: string): Promise<Subgroup> {
    return await db.subgroup.create({
      data: { name },
    })
  },

  async findById(id: string): Promise<Subgroup | null> {
    return await db.subgroup.findUnique({
      where: { id },
    })
  },

  async delete(id: string): Promise<void> {
    await db.subgroup.delete({
      where: { id },
    })
  },

  async checkInProducts(subgroupName: string): Promise<Pick<Product, 'id'> | null> {
    return await db.product.findFirst({
      where: {
        masterProduct: {
          subgroup: subgroupName,
        },
      },
      select: { id: true },
    })
  },
}