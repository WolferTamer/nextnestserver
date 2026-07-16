import { Request } from "express";
import z, { ZodObject } from "zod";

export type ValidatedRequest<T extends ZodObject> = Request & {
  validated: z.infer<T>;
};
