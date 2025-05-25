import { z } from "zod";
import { EmailSchema } from "../shared/base.schema";

export const ResetSchema = z.object({
  email: EmailSchema,
});