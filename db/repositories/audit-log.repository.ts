import { db } from "@/lib/db";
import { AuditLogResponse } from "@/types";

export const auditLogRepository = {
  async create(data: AuditLogResponse): Promise<void> {
    await db.auditLog.create({ data });
  },
};
