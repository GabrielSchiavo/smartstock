import { db } from "@/lib/db";
import { Product } from "@prisma/client";

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

  async create(name: string) {
    return await db.supplier.create({
      data: { name },
    });
  },

  async delete(id: string) {
    return await db.supplier.delete({
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
