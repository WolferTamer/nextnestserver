import { Response, NextFunction, RequestHandler } from "express";
import { ValidatedRequest } from "../types/validate";
import { ZodObject } from "zod";
import { requireAuth } from "./requireAuth";
import { AuthenticatedValidatedRequest } from "../types/auth";

export function authenticateAndValidate<T extends ZodObject>(
  schema: T,
  handler: (
    req: AuthenticatedValidatedRequest<T>,
    res: Response,
    next: NextFunction,
  ) => any,
): RequestHandler[] {
  const runValidation: RequestHandler = (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) return next(result.error);

    req.validated = result.data;
    next();
  };

  const runHandler: RequestHandler = (req, res, next) =>
    handler(req as AuthenticatedValidatedRequest<T>, res, next);

  return [requireAuth, runValidation, runHandler];
}
