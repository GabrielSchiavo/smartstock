import { db } from "@/lib/db";
import { MovementResponse } from "@/types/models/movement.model";

export const movementRepository = {
  async createInput(data: MovementResponse): Promise<void> {
    await db.stockMovement.create({ data });
  },
};
