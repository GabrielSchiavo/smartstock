"use server"

import { currentRole } from "@/lib/auth"
import { UserType } from "@/types/index.enums";

export const admin = async () => {
    const role = await currentRole();

    if (role === UserType.ADMIN) {
        return { success: "Ação de servidor permitida!" }
    }

    return { error: "Ação de servidor proibida!" }
}