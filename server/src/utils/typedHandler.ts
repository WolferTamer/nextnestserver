import { ValidatedRequest } from "../types/validate";
import { NextFunction, RequestHandler, Response } from "express";
import { ZodObject } from "zod";

export function typedHandler<T extends ZodObject>(
  handler: (req: ValidatedRequest<T>, res: Response, next: NextFunction) => any,
): RequestHandler {
  return (req, res, next) => handler(req as ValidatedRequest<T>, res, next);
}
