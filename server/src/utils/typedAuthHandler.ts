import { NextFunction, RequestHandler, Response } from "express";
import { ZodObject } from "zod";
import { AuthenticatedValidatedRequest } from "../types/auth";

export function typedAuthHandler<T extends ZodObject>(
  handler: (
    req: AuthenticatedValidatedRequest<T>,
    res: Response,
    next: NextFunction,
  ) => unknown,
): RequestHandler {
  return (req, res, next) =>
    handler(req as AuthenticatedValidatedRequest<T>, res, next);
}
