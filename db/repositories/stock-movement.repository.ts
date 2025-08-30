import { db } from "@/lib/db";
import { EntityType } from "@/types";
import {
  StockMovementResponse,
  StockMovementWithProductResponse,
} from "@/types/models/stock-movement.model";
import { StockMovement } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

export const stockMovementRepository = {
  async createInput(data: StockMovementResponse): Promise<StockMovement> {
    return (await db.stockMovement.create({ data })) as StockMovement;
  },

  async createOutput(data: StockMovementResponse): Promise<StockMovement> {
    const { ...movementOutputData } = data;

    return (await db.stockMovement.create({
      data: movementOutputData,
      include: {
        product: true,
      },
    })) as StockMovement;
  },

  async findInputs(): Promise<StockMovementWithProductResponse[]> {
    const today = new Date();
    return await db.stockMovement.findMany({
      where: {
        movementType: EntityType.INPUT,
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findOutputs(): Promise<StockMovementWithProductResponse[]> {
    const today = new Date();

    return await db.stockMovement.findMany({
      where: {
        movementType: EntityType.OUTPUT,
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findAdjustments(): Promise<StockMovementWithProductResponse[]> {
    const today = new Date();
    return await db.stockMovement.findMany({
      where: {
        movementType: {
          in: [EntityType.ADJUSTMENT_POSITIVE, EntityType.ADJUSTMENT_NEGATIVE],
        },
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
