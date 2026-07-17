import z from "zod";

export const getWeatherValidator = z.object({
  query: z.object({
    id: z.coerce.number().int().positive().optional(),
  }),
});
