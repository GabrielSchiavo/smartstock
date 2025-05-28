import { z } from "zod";
import { EmailSchema } from "@/schemas/shared/base.schema";

export const ResetSchema = z.object({
  email: EmailSchema,
});