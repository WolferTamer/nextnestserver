import { NextFunction, RequestHandler, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";

export function authHandler(
  handler: (
    req: AuthenticatedRequest,
    tes: Response,
    next: NextFunction,
  ) => unknown,
): RequestHandler {
  return (req, res, next) => handler(req as AuthenticatedRequest, res, next);
}
