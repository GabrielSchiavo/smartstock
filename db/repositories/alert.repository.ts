import { db } from "@/lib/db";
import { daysDefaultUntilExpiry } from "@/utils/check-expiry-status";
import { AlertType } from "@prisma/client";

export const alertRepository = {
  async findExpiringProducts() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + daysDefaultUntilExpiry);

    return await db.product.findMany({
      where: {
        // quantity: {
        //   gt: 0, // só produtos com quantidade acima de zero
        // },
        OR: [
          {
            validityDate: {
              lte: thirtyDaysFromNow,
              gte: today,
            },
          },
          {
            validityDate: {
              lt: today,
            },
          },
        ],
      },
    });
  },

  async findOutStockProducts() {
    return await db.product.findMany({
      where: {
        quantity: 0,
      },
    });
  },

  async findExisting(productId: number, type: AlertType) {
    return await db.alertSystem.findFirst({
      where: {
        productId,
        type,
      },
    });
  },

  async create(productId: number, type: AlertType) {
    return await db.alertSystem.create({
      data: {
        productId,
        type,
      },
    });
  },

  async updateReadStatus(alertId: string, isRead: boolean) {
    return await db.alertSystem.update({
      where: { id: alertId },
      data: { isRead },
    });
  },

  async updateAllReadStatus(isRead: boolean) {
    return await db.alertSystem.updateMany({
      where: { isRead: !isRead },
      data: { isRead },
    });
  },

  async deleteAll() {
    return await db.alertSystem.deleteMany();
  },

  async getAll() {
    return await db.alertSystem.findMany({
      include: { product: true },
      orderBy: [
        { createdAt: "desc" }, // Mais recentes primeiro
        { type: "asc" },
      ],
    });
  },

  async unreadCount() {
    return await db.alertSystem.count({
      where: { isRead: false },
    });
  },

  async getById(alertId: string) {
    return await db.alertSystem.findUnique({
      where: { id: alertId },
    });
  },

  async toggleReadStatus(alertId: string, isRead: boolean) {
    return await db.alertSystem.update({
      where: { id: alertId },
      data: { isRead: isRead },
    });
  },
};
