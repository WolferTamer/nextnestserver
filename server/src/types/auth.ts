import { Request } from "express";
import z, { ZodObject } from "zod";

export interface AuthUser {
  userid: number;
}

export type AuthenticatedRequest = Request & { user: AuthUser };

export type AuthenticatedValidatedRequest<T extends ZodObject> = Request & {
  user: AuthUser;
  validated: z.infer<T>;
};
