import { db } from "@/lib/db"
import { Group, MasterProduct, Prisma } from "@prisma/client"

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

  async create(name: string, tx?: Prisma.TransactionClient): Promise<Group> {
    const client = tx ?? db;

    return await client.group.create({
      data: { name },
    })
  },

  async findById(id: string): Promise<Group | null> {
    return await db.group.findUnique({
      where: { id },
    })
  },

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? db;

    await client.group.delete({
      where: { id },
    })
  },

  async checkInMasterProducts(groupName: string): Promise<Pick<MasterProduct, 'id'> | null> {
    return await db.masterProduct.findFirst({
      where: {
          group: groupName,
      },
      select: { id: true },
    })
  },
}