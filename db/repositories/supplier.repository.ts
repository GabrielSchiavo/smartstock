import { db } from "@/lib/db";
import { Prisma, Product } from "@prisma/client";

export const supplierRepository = {
  async findAll(take = 100) {
    return await db.supplier.findMany({
      orderBy: { name: "asc" },
      take,
    });
  },

  async count() {
    return await db.supplier.count();
  },

  async search(query: string, take = 10) {
    return await db.supplier.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take,
    });
  },

  async findByName(name: string) {
    return await db.supplier.findFirst({
      where: { name },
    });
  },

  async create(name: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? db;

    return await client.supplier.create({
      data: { name },
    });
  },

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? db;

    return await client.supplier.delete({
      where: { id },
    });
  },

  async findById(id: string) {
    return await db.supplier.findUnique({
      where: { id },
    });
  },

  async checkInProducts(
    supplierName: string
  ): Promise<Pick<Product, "id"> | null> {
    return await db.product.findFirst({
      where: {
        supplier: supplierName,
      },
      select: { id: true },
    });
  },
};
