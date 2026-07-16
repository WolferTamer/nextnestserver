import { Request } from "express";
import z, { ZodObject } from "zod";

export interface AuthUser {
  userid: number;
  email: string;
}

export type AuthenticatedRequest = Request & { user: AuthUser };

export type AuthenticatedValidatedRequest<T extends ZodObject> = Request & {
  user: AuthUser;
  validated: z.infer<T>;
};
