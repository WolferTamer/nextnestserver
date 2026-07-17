import z from "zod";

export const getCityValidator = z.object({
  query: z.object({
    id: z.coerce.number().int().positive().optional(),
    name: z.string().optional(),
  }),
});
