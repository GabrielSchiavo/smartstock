import { AuditLog, User } from "@prisma/client";
import { EntityType, ActionType } from "@/types/enums/enums";

export type AuditLogResponse = {
  createdAt: Date;
  userId: string;
  recordChangedId: string;
  actionType: ActionType;
  entity: EntityType;
  value: string;
  observation: string;
};

export type AuditLogWithUserResponse = AuditLog & {
  user: User;
};
