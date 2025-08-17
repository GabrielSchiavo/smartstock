import { db } from "@/lib/db";

export const categoryRepository = {
  async findAll(take = 100) {
    return await db.category.findMany({
      orderBy: { name: "asc" },
      take,
    });
  },

  async count() {
    return await db.category.count();
  },

  async search(query: string, take = 10) {
    return await db.category.findMany({
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
    return await db.category.findFirst({
      where: { name },
    });
  },

  async create(name: string) {
    return await db.category.create({
      data: { name },
    });
  },

  async delete(id: string) {
    return await db.category.delete({
      where: { id },
    });
  },

  async findById(id: string) {
    return await db.category.findUnique({
      where: { id },
    });
  },

  async checkCategoryUsage(categoryName: string) {
    return await db.product.findFirst({
      where: {
        category: categoryName,
      },
      select: { id: true },
    });
  },
};
