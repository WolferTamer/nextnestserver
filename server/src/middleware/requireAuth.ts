import { NextFunction, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { AuthenticatedRequest, AuthUser } from "../types/auth";

export function requireAuth(
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => any,
): RequestHandler[] {
  const authHandler: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
      const user = jwt.verify(token, process.env.SECRETKEY!);
      if (!user || typeof user === "string") {
        throw new UnauthorizedError();
      }
      req.user = { userid: user.sub!, role: user.role };
    } catch {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  };

  const runHandler: RequestHandler = (req, res, next) =>
    handler(req as AuthenticatedRequest, res, next);
  return [authHandler, runHandler];
}
