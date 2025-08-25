import { AuditLog, User } from "@prisma/client";
import { ActionCategoryType, ActionType } from "../enums/enums";

export type AuditLogResponse = {
  createdAt: Date;
  userId: string;
  recordChangedId: string;
  actionType: ActionType;
  actionCategory: ActionCategoryType;
  value: string;
  observation: string;
};

export type AuditLogWithUserResponse = AuditLog & {
  user: User;
};
