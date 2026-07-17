import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";
import { Prisma } from "../generated/prisma/client";
import { treeifyError, ZodError } from "zod";
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Known, operational errors — safe to expose the message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.constructor.name,
        message: err.message,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "ValidationError",
        message: "Invalid request data",
        details: treeifyError(err),
      },
    });
  }

  // Prisma errors — translate DB-level failures into meaningful responses
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: {
          code: "ConflictError",
          message: "A record with this value already exists",
        },
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        error: { code: "NotFoundError", message: "Record not found" },
      });
    }
  }

  // Unexpected/programming errors — log full detail, never expose internals
  console.error(err);
  return res.status(500).json({
    error: {
      code: "InternalServerError",
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : err.message,
    },
  });
}
