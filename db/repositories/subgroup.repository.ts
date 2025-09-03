import { db } from "@/lib/db"
import { MasterProduct, Prisma, Subgroup } from "@prisma/client"

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

  async create(name: string, tx?: Prisma.TransactionClient): Promise<Subgroup> {
    const client = tx ?? db;

    return await client.subgroup.create({
      data: { name },
    })
  },

  async findById(id: string): Promise<Subgroup | null> {
    return await db.subgroup.findUnique({
      where: { id },
    })
  },

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? db;

    await client.subgroup.delete({
      where: { id },
    })
  },

  async checkInMasterProducts(subgroupName: string): Promise<Pick<MasterProduct, 'id'> | null> {
    return await db.masterProduct.findFirst({
      where: {
          subgroup: subgroupName,
      },
      select: { id: true },
    })
  },
}