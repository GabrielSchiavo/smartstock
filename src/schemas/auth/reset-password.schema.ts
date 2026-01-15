import { z } from "zod";
import { EmailSchema } from "@/schemas/shared/base-auth.schema";

export const ResetSchema = z.object({
  email: EmailSchema,
});