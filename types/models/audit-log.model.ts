import { AuditLog, User } from "@prisma/client";
import { EntityType, ActionType } from "@/types/enums/enums";

export type AuditLogResponse = {
  createdAt: Date;
  userId: string | null;
  recordChangedId: string | null;
  actionType: ActionType;
  entity: EntityType;
  changedValue: string | null;
  ipAddress?: string | null;
  targetEmail?: string | null;
  details: string;
};

export type AuditLogWithUserResponse = AuditLog & {
  user: User | null;
};
