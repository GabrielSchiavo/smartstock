import { db } from "@/lib/db";
import { EntityType } from "@/types";
import {
  StockMovementResponse,
  StockMovementWithProductResponse,
} from "@/types/models/stock-movement.model";
import { Prisma, StockMovement } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

export const stockMovementRepository = {
  async createInput(
    data: StockMovementResponse,
    tx?: Prisma.TransactionClient
  ): Promise<StockMovement> {
    const client = tx ?? db;

    return (await client.stockMovement.create({ data })) as StockMovement;
  },

  async createOutput(
    data: StockMovementResponse,
    tx?: Prisma.TransactionClient
  ): Promise<StockMovement> {
    const { ...movementOutputData } = data;
    const client = tx ?? db;

    return (await client.stockMovement.create({
      data: movementOutputData,
      include: {
        product: true,
      },
    })) as StockMovement;
  },

  async createAdjustment(
    data: StockMovementResponse,
    tx?: Prisma.TransactionClient
  ): Promise<StockMovement> {
    const { ...movementAdjustmentData } = data;
    const client = tx ?? db;

    return (await client.stockMovement.create({
      data: movementAdjustmentData,
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

  async findInputsByDate(
    initialDate: Date,
    finalDate: Date
  ): Promise<StockMovementWithProductResponse[]> {
    return db.stockMovement.findMany({
      where: {
        movementType: EntityType.INPUT,
        createdAt: { gte: initialDate, lte: finalDate },
      },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
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

  async findOutputsByDate(
    initialDate: Date,
    finalDate: Date
  ): Promise<StockMovementWithProductResponse[]> {
    return db.stockMovement.findMany({
      where: {
        movementType: EntityType.OUTPUT,
        createdAt: { gte: initialDate, lte: finalDate },
      },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
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

  async findAdjustmentsByDate(
    initialDate: Date,
    finalDate: Date
  ): Promise<StockMovementWithProductResponse[]> {
    return db.stockMovement.findMany({
      where: {
        movementType: {
          in: [EntityType.ADJUSTMENT_POSITIVE, EntityType.ADJUSTMENT_NEGATIVE],
        },
        createdAt: { gte: initialDate, lte: finalDate },
      },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
