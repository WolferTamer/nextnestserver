import { z } from "../lib/zod.js";

export const loginBodySchema = z
  .object({
    user: z.object({
      email: z.email(),
      password: z.string().max(255),
    }),
  })
  .openapi("LoginBody");

export const postAuthValidator = z.object({
  body: loginBodySchema,
});

export const authResponseSchema = z
  .object({
    auth: z.string(),
    user: z.object({
      userid: z.number().int().positive(),
      username: z.string(),
    }),
  })
  .openapi("Auth");
