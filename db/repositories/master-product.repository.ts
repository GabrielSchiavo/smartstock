import {
  MasterProductResponse,
  MasterProductUpdateResponse,
  MasterProductWithCategoryGroupSubgroupResponse,
} from "@/types";
import { db } from "@/lib/db";
import { MasterProduct, Prisma, Product } from "@prisma/client";

export const masterProductRepository = {
  async create(
    data: MasterProductResponse,
    tx?: Prisma.TransactionClient
  ): Promise<MasterProduct> {
    const client = tx ?? db;

    return (await client.masterProduct.create({
      data: data,
      include: {
        category: true,
        group: true,
        subgroup: true,
      },
    })) as MasterProduct;
  },

  async findAll(): Promise<MasterProductWithCategoryGroupSubgroupResponse[]> {
    return await db.masterProduct.findMany({
      orderBy: { id: "asc" },
      include: {
        category: true,
        group: true,
        subgroup: true,
      },
    });
  },

  async countMasterProducts(): Promise<number> {
    return db.masterProduct.count();
  },

  async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? db;

    await client.masterProduct.delete({
      where: { id },
      include: {
        category: true,
        group: true,
        subgroup: true,
      },
    });
  },

  async findById(id: number): Promise<MasterProduct | null> {
    return await db.masterProduct.findUnique({
      where: { id },
      include: {
        category: true,
        group: true,
        subgroup: true,
      },
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
      include: {
        category: true,
        group: true,
        subgroup: true,
      },
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
