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
    return await db.notification.findFirst({
      where: {
        productId,
        type,
      },
    });
  },

  async create(productId: number, type: AlertType) {
    return await db.notification.create({
      data: {
        productId,
        type,
      },
    });
  },

  async updateReadStatus(alertId: string, isRead: boolean) {
    return await db.notification.update({
      where: { id: alertId },
      data: { isRead },
    });
  },

  async updateAllReadStatus(isRead: boolean) {
    return await db.notification.updateMany({
      where: { isRead: !isRead },
      data: { isRead },
    });
  },

  async deleteAll() {
    return await db.notification.deleteMany();
  },

  async getAll() {
    return await db.notification.findMany({
      include: { product: true },
      orderBy: [
        { type: "asc" }, // EXPIRED vem antes de EXPIRING (ordem alfabética inversa)
        { createdAt: "desc" }, // Mais recentes primeiro
      ],
    });
  },

  async unreadCount() {
    return await db.notification.count({
      where: { isRead: false },
    });
  },

  async getById(alertId: string) {
    return await db.notification.findUnique({
      where: { id: alertId },
    });
  },

  async toggleReadStatus(alertId: string, isRead: boolean) {
    return await db.notification.update({
      where: { id: alertId },
      data: { isRead: isRead },
    });
  },
};
