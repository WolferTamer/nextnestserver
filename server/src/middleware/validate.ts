import { Response, NextFunction, RequestHandler } from "express";
import { ValidatedRequest } from "../types/validate";
import { ZodType } from "zod";

export function validatedRoute<T extends ZodType>(
  schema: T,
  handler: (
    req: ValidatedRequest<T>,
    res: Response,
    next: NextFunction,
  ) => unknown,
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
    handler(req as ValidatedRequest<T>, res, next);

  return [runValidation, runHandler];
}
