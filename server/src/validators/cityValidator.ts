import { z } from "../lib/zod.js";
import { TaxObjValidator } from "./taxValidator.js";
import { WeatherObjValidator } from "./weatherValidator.js";

export const getCityParams = z
  .object({
    id: z.coerce.number().int().positive(),
    taxes: z.coerce.boolean().optional().default(false),
    weather: z.coerce.boolean().optional().default(false),
  })
  .openapi("GetCityParams");
export const getCityQuery = z
  .object({
    taxes: z.coerce.boolean().optional().default(false),
    weather: z.coerce.boolean().optional().default(false),
  })
  .openapi("GetCityQuery");

export const getCityValidator = z.object({
  params: getCityParams,
  query: getCityQuery,
});

export const getManyCitiesQuery = z
  .object({
    name: z.string().optional(),
    taxes: z.coerce.boolean().optional().default(false),
    weather: z.coerce.boolean().optional().default(false),
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
    weather: z.array(WeatherObjValidator).optional(),
    tax: z.array(TaxObjValidator).optional(),
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
