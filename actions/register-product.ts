"use server";

import { CreateProductSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";

export const registerProduct = async (values: z.infer<typeof CreateProductSchema>) => {
    const validateFields = CreateProductSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"};
    }

    const { name, quantity, unit, lot, validityDate, donor, receiptDate, receiver, group, subgroup, productType } = validateFields.data;

    const convertNumber = Number(quantity);

    await db.product.create({
        data: {
            name, 
            quantity: convertNumber, 
            unit, 
            lot, 
            validityDate, 
            donor, 
            receiptDate, 
            receiver, 
            group, 
            subgroup, 
            productType
        }
    });

    return { success: "Registration completed successfully!" };
}