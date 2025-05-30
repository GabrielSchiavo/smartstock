"use server"

import { signOut } from "@/auth"
import { revalidatePath } from "next/cache";

export const logout = async () => {
    revalidatePath("/");
    await signOut();
}