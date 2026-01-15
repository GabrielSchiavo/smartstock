import { db } from "@/lib/db"

export const passwordResetTokenRepository = {
    async findByToken(token: string) {
      try {
        return await db.passwordResetToken.findUnique({
          where: { token },
        })
      } catch {
        return null
      }
    },
    
    async findByEmail(email: string) {
      try {
        return await db.passwordResetToken.findFirst({
          where: { email },
        })
      } catch {
        return null
      }
    },

    create: async (data: { email: string; token: string; expires: Date }) => {
      return await db.passwordResetToken.create({
        data
      });
    },
    
    async delete(id: string): Promise<void> {
      await db.passwordResetToken.delete({
        where: { id },
      })
    },

}