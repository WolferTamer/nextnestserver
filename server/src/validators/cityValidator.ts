import { z } from "../lib/zod.js";

export const getCityParams = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi("GetCityParams");

export const getCityValidator = z.object({
  params: getCityParams,
});

export const getManyCitiesQuery = z
  .object({
    name: z.string().optional(),
  })
  .openapi("GetCitiesQuery");

export const getManyCitiesValidator = z.object({
  query: getManyCitiesQuery,
});

const City = z
  .object({
    id: z.number().positive().int(),
    name: z.string(),
    state: z.string(),
    statecode: z.string().length(2),
    density: z.number(),
    growth: z.number(),
    population: z.number().positive().int(),
    lat: z.number(),
    lon: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .openapi("City");

export const manyCitiesResponse = z
  .object({
    cities: z.array(City),
  })
  .openapi("ManyCitiesResponse");

export const cityResponse = z
  .object({
    city: City,
  })
  .openapi("CityResponse");
