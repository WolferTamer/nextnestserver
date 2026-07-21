import { z } from "../lib/zod.js";

export const getIncomeTaxParams = z
  .object({
    state: z.string(),
  })
  .openapi("GetIncomeTaxParams");
export const getIncomeTaxQuery = z
  .object({
    salary: z.coerce.number().int().positive().optional(),
  })
  .openapi("GetIncomeTaxQuery");

export const getIncometaxValidator = z.object({
  params: getIncomeTaxParams,
  query: getIncomeTaxQuery,
});

export const getMyIncometaxQuery = z.object({
  state: z.string(),
});
export const getMyIncometaxValidator = z.object({
  query: getMyIncometaxQuery,
});
