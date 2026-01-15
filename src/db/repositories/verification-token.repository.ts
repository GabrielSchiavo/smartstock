import { db } from "@/lib/db"

export const verificationTokenRepository = {
    async findByToken(token: string) {
      try {
        return await db.verificationToken.findUnique({
          where: { token },
        })
      } catch {
        return null
      }
    },
    
    async findByEmail(email: string) {
      try {
        return await db.verificationToken.findFirst({
          where: { email },
        })
      } catch {
        return null
      }
    },

    create: async (data: { email: string; token: string; expires: Date }) => {
      return await db.verificationToken.create({
        data
      });
    },
    
    async delete(id: string): Promise<void> {
      await db.verificationToken.delete({
        where: { id },
      })
    },
}