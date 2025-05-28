import { v4 as uuidv4 } from "uuid";

import { passwordResetTokenRepository, verificationTokenRepository } from "@/db";

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // One hour expires

     const existingToken = await passwordResetTokenRepository.findByEmail(email);

     if (existingToken) {
        await passwordResetTokenRepository.delete(existingToken.id);
     }

     return await passwordResetTokenRepository.create({
        email,
        token,
        expires
    });
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // One hour expires

    const existingToken = await verificationTokenRepository.findByEmail(email); 

    if (existingToken) {
        await verificationTokenRepository.delete(existingToken.id);
    }

   return await verificationTokenRepository.create({
        email,
        token,
        expires
    });
}