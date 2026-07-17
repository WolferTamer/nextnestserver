import z from "zod";

export const getTaxValidator = z.object({
  query: z.object({
    id: z.coerce.number().int().positive().optional(),
  }),
});
