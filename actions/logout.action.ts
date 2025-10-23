"use server";

import { auditLogRepository } from "@/db";
import { signOut } from "@/lib/auth";
import { ActionType, EntityType } from "@/types";
import { currentUser } from "@/utils/current-session-utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const logout = async () => {
  const ip = (await headers()).get("x-forwarded-for") ?? "UNKNOWN_IP";

  revalidatePath("/");

  const user = await currentUser();

  if (!user || !user.id) {
    await signOut();
    return;
  }

  await auditLogRepository.create({
    createdAt: new Date(),
    userId: user.id,
    recordChangedId: null,
    actionType: ActionType.LOGOUT,
    entity: EntityType.SYSTEM,
    changedValue: null,
    ipAddress: ip,
    details: `[SYSTEM] Action='${ActionType.LOGOUT}' | Entity='${EntityType.SYSTEM}' | User ID='${user.id}' | User='${user.name}' | IP='${ip}' | Message='Successful logout' | Date Time='${new Date().toISOString()}'`,
  });

  await signOut();
};
