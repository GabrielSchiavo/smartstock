import { MasterItemResponse, MasterItemUpdateResponse } from "@/types";
import { db } from "@/lib/db";
import { MasterProduct } from "@prisma/client";

export const masterItemRepository = {
  async create(data: MasterItemResponse): Promise<void> {
    await db.masterProduct.create({ data });
  },

  async findAll(): Promise<MasterProduct[]> {
    return await db.masterProduct.findMany({
      orderBy: { id: "asc" },
    });
  },

  async countMasterItems(): Promise<number> {
    return db.masterProduct.count()
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

  async update(id: number, data: MasterItemUpdateResponse): Promise<MasterProduct> {
    return await db.masterProduct.update({
      where: { id },
      data,
    });
  },
};
