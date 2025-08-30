import { db } from "@/lib/db";
import {
  EntityType,
  AuditLogResponse,
  AuditLogWithUserResponse,
} from "@/types";

export const auditLogRepository = {
  async create(data: AuditLogResponse): Promise<void> {
    await db.auditLog.create({ data, include: { user: true } });
  },

  async findAll(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async findInputs(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      where: {
        entity: EntityType.INPUT,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findOutputs(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      where: {
        entity: EntityType.OUTPUT,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findAdjustments(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      where: {
        entity: {
          in: [EntityType.ADJUSTMENT_POSITIVE, EntityType.ADJUSTMENT_NEGATIVE],
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findInputOutput(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      where: {
        entity: {
          in: [EntityType.INPUT, EntityType.OUTPUT],
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findSeveral(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      where: {
        NOT: {
          entity: {
            in: [
              EntityType.INPUT,
              EntityType.OUTPUT,
              EntityType.ADJUSTMENT_POSITIVE,
              EntityType.ADJUSTMENT_NEGATIVE,
            ],
          },
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findSystem(): Promise<AuditLogWithUserResponse[]> {
    return await db.auditLog.findMany({
      where: {
        entity: EntityType.SYSTEM,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
