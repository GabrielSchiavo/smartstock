import { z } from "zod";
import { PasswordSchema } from "../shared/base.schema";

export const NewPasswordSchema = z.object({
  password: PasswordSchema,
});