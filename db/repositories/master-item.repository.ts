import { MasterItemResponse, MasterItemUpdateResponse } from "@/types";
import { db } from "@/lib/db";
import { MasterItem } from "@prisma/client";

export const masterItemRepository = {
  async create(data: MasterItemResponse): Promise<void> {
    await db.masterItem.create({ data });
  },

  async findAll(): Promise<MasterItem[]> {
    return await db.masterItem.findMany({
      orderBy: { id: "asc" },
    });
  },

  async countMasterItems(): Promise<number> {
    return db.masterItem.count()
  },

  async delete(id: number): Promise<void> {
    await db.masterItem.delete({
      where: { id },
    });
  },

  async findById(id: number): Promise<MasterItem | null> {
    return await db.masterItem.findUnique({
      where: { id },
    });
  },

  async update(id: number, data: MasterItemUpdateResponse): Promise<MasterItem> {
    return await db.masterItem.update({
      where: { id },
      data,
    });
  },
};
