import z from "zod";

export const getIncometaxValidator = z.object({
  params: z.object({
    state: z.string(),
  }),
  query: z.object({
    salary: z.coerce.number().int().positive().optional(),
  }),
});

export const getMyIncometaxValidator = z.object({
  query: z.object({
    state: z.string(),
  }),
});
