import { MasterProductResponse, MasterProductUpdateResponse } from "@/types";
import { db } from "@/lib/db";
import { MasterProduct, Prisma, Product } from "@prisma/client";

export const masterProductRepository = {
  async create(data: MasterProductResponse, tx?: Prisma.TransactionClient): Promise<MasterProduct> {
    const client = tx ?? db;

    return (await client.masterProduct.create({
      data: data,
    })) as MasterProduct;
  },

  async findAll(): Promise<MasterProduct[]> {
    return await db.masterProduct.findMany({
      orderBy: { id: "asc" },
    });
  },

  async countMasterProducts(): Promise<number> {
    return db.masterProduct.count();
  },

  async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? db;

    await client.masterProduct.delete({
      where: { id },
    });
  },

  async findById(id: number): Promise<MasterProduct | null> {
    return await db.masterProduct.findUnique({
      where: { id },
    });
  },

  async update(
    id: number,
    data: MasterProductUpdateResponse,
    tx?: Prisma.TransactionClient
  ): Promise<MasterProduct> {
    const client = tx ?? db;

    return await client.masterProduct.update({
      where: { id },
      data,
    });
  },

  async checkInProducts(
    masterProductId: number
  ): Promise<Pick<Product, "id"> | null> {
    return await db.product.findFirst({
      where: {
        masterProductId: masterProductId,
      },
      select: { id: true },
    });
  },
};
