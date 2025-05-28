import { z } from "zod";
import { PasswordSchema } from "@/schemas/shared/base.schema";

export const NewPasswordSchema = z.object({
  password: PasswordSchema,
});