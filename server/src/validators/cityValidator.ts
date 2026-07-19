import z from "zod";

export const getCityValidator = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const getManyCitiesValidator = z.object({
  query: z.object({
    name: z.string().optional(),
  }),
});
