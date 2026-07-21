import { z } from "../lib/zod.js";

export const searchQuery = z
  .object({
    name: z.string().max(30).optional(),
    weather: z.coerce.number().int().max(255).min(0).optional(),
    salestax: z.coerce.number().positive().optional(),
    allowlocal: z.coerce.boolean().default(true),
    married: z.coerce.boolean().default(false),
    salary: z.coerce.number().int().positive().optional(),
    maxincome: z.coerce.number().positive().optional(),
  })
  .openapi("SearchQuery");

export const searchValidator = z.object({
  query: searchQuery,
});
