import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { AuthUser } from "../types/auth";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, process.env.SECRETKEY!) as AuthUser;
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
