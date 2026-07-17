import { Request } from "express";
import z, { ZodType } from "zod";

export type ValidatedRequest<T extends ZodType> = Request & {
  validated: z.infer<T>;
};
