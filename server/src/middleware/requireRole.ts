import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
export function requireRole(role: "USER" | "ADMIN") {
  const authHandler: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
      const user = jwt.verify(token, process.env.SECRETKEY!);
      if (
        !user ||
        typeof user === "string" ||
        (user.role !== "ADMIN" && user.role !== role)
      ) {
        throw new UnauthorizedError();
      }
      next();
    } catch {
      next(new UnauthorizedError("Incorrect Role"));
    }
  };
  return authHandler;
}
