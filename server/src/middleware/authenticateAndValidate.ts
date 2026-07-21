import { Response, NextFunction, RequestHandler } from "express";
import { ZodObject } from "zod";
import { AuthenticatedValidatedRequest } from "../types/auth";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";

export function authenticateAndValidate<T extends ZodObject>(
  schema: T,
  handler: (
    req: AuthenticatedValidatedRequest<T>,
    res: Response,
    next: NextFunction,
  ) => unknown,
): RequestHandler[] {
  const authHandler: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new UnauthorizedError("Invalid or expired token"));
    }

    try {
      const user = jwt.verify(token, process.env.SECRETKEY!);
      if (!user || typeof user === "string") {
        throw new UnauthorizedError();
      }
      req.user = { userid: user.sub!, role: user.role };
      next();
    } catch {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  };

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

  return [authHandler, runValidation, runHandler];
}
