import z from "zod";

export const searchValidator = z.object({
  query: z.object({
    name: z.string().max(30).optional(),
    weather: z.coerce.number().int().max(255).min(0).optional(),
    salestax: z.coerce.number().positive().optional(),
    allowlocal: z.coerce.boolean().default(true),
    married: z.coerce.boolean().default(false),
    salary: z.coerce.number().int().positive().optional(),
    maxincome: z.coerce.number().positive().optional(),
  }),
});
