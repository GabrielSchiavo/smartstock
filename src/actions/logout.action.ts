"use server";

import { auditLogRepository } from "@/db";
import { signOut } from "@/lib/auth";
import { ActionType, EntityType } from "@/types";
import { currentUser } from "@/utils/current-session-utils";
import { getIpAddress } from "@/utils/ip-address-utils";
import { revalidatePath } from "next/cache";

export const logout = async () => {
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
    ipAddress: await getIpAddress(),
    details: `[SYSTEM] Action='${ActionType.LOGOUT}' | Entity='${EntityType.SYSTEM}' | User ID='${user.id}' | User='${user.name}' | IP Address='${await getIpAddress()}' | Message='Logout Successful' | Date Time='${new Date().toISOString()}'`,
  });

  await signOut();
};
