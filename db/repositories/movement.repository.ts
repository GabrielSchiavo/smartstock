import { db } from "@/lib/db";
import { MovementResponse } from "@/types/models/movement.model";
import { StockMovement } from "@prisma/client";

export const movementRepository = {
  async createInput(data: MovementResponse): Promise<StockMovement> {
    return (await db.stockMovement.create({ data })) as StockMovement;
  },

  async createOutput(data: MovementResponse): Promise<StockMovement> {
    const { ...movementOutputData } = data;

    return (await db.stockMovement.create({
      data: movementOutputData,
      include: {
        product: true,
      },
    })) as StockMovement;
  },
};
