import { z } from "../lib/zod.js";

export const getWeatherQuery = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi("GetWeatherQuery");
export const getWeatherValidator = z.object({
  query: getWeatherQuery,
});

export const weatherResponse = z.object({
  weather: z.object({
    id: z.number().positive().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    cityId: z.number().positive().int(),
    jantemp: z.number().optional(),
    janhumidity: z.number().optional(),
    janprecipitation: z.number().optional(),
    janwind: z.number().optional(),
    janclouds: z.number().optional(),
    julytemp: z.number().optional(),
    julyhumidity: z.number().optional(),
    julyprecipitation: z.number().optional(),
    julyclouds: z.number().optional(),
    julywind: z.number().optional(),
  }),
});

export const manyWeatherResponse = z.object({
  weather: z.array(
    z.object({
      id: z.number().positive().int(),
      createdAt: z.date(),
      updatedAt: z.date(),
      cityId: z.number().positive().int(),
      jantemp: z.number().optional(),
      janhumidity: z.number().optional(),
      janprecipitation: z.number().optional(),
      janwind: z.number().optional(),
      janclouds: z.number().optional(),
      julytemp: z.number().optional(),
      julyhumidity: z.number().optional(),
      julyprecipitation: z.number().optional(),
      julyclouds: z.number().optional(),
      julywind: z.number().optional(),
    }),
  ),
});
