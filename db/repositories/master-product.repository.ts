import { MasterProductResponse, MasterProductUpdateResponse } from "@/types";
import { db } from "@/lib/db";
import { MasterProduct, Product } from "@prisma/client";

export const masterProductRepository = {
  async create(data: MasterProductResponse): Promise<MasterProduct> {
    return (await db.masterProduct.create({
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

  async delete(id: number): Promise<void> {
    await db.masterProduct.delete({
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
    data: MasterProductUpdateResponse
  ): Promise<MasterProduct> {
    return await db.masterProduct.update({
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
