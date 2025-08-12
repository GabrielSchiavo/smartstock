import { db } from "@/lib/db";

export const donorRepository = {
  async findAll(take = 100) {
    return await db.donor.findMany({
      orderBy: { name: "asc" },
      take,
    });
  },

  async count() {
    return await db.donor.count();
  },

  async search(query: string, take = 10) {
    return await db.donor.findMany({
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
    return await db.donor.findFirst({
      where: { name },
    });
  },

  async create(name: string) {
    return await db.donor.create({
      data: { name },
    });
  },

  async delete(id: string) {
    return await db.donor.delete({
      where: { id },
    });
  },

  async findById(id: string) {
    return await db.donor.findUnique({
      where: { id },
    });
  },

  async checkDonorUsage(donorName: string) {
    return await db.product.findFirst({
      where: {
        donor: donorName,
      },
      select: { id: true },
    });
  },
};
