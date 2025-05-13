import { db } from "@/lib/db"

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordresetToken = await db.passwordResetToken.findUnique({
            where: { token }
        });

        return passwordresetToken;
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordresetToken = await db.passwordResetToken.findFirst({
            where: { email }
        });

        return passwordresetToken;
    } catch {
        return null;
    }
};