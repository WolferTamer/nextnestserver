import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.email(),
    username: z.string().min(1).max(255),
    password: z.string().min(8).max(20),
  }),
});

export const getUserSchema = z.object({
  query: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const updateUserSchema = z.object({
  query: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    salary: z.number().int().positive(),
  }),
});
