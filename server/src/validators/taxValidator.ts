import { z } from "../lib/zod.js";

export const getTaxQuery = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi("GetTaxQuery");

export const getTaxValidator = z.object({
  query: getTaxQuery,
});

export const taxResponse = z.object({
  tax: z.object({
    id: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
    salestax: z.number().optional(),
    propertytaxquarter: z.number().optional(),
    propertytaxthreequarters: z.number().optional(),
    cityId: z.number().int().positive(),
    localtaxes: z.boolean().optional(),
    singlestandarddeduction: z.number().optional(),
    marriedstandarddeduction: z.number().optional(),
  }),
});

export const taxesResponse = z.object({
  tax: z.array(
    z.object({
      id: z.number().int().positive(),
      createdAt: z.date(),
      updatedAt: z.date(),
      salestax: z.number().optional(),
      propertytaxquarter: z.number().optional(),
      propertytaxthreequarters: z.number().optional(),
      cityId: z.number().int().positive(),
      localtaxes: z.boolean().optional(),
      singlestandarddeduction: z.number().optional(),
      marriedstandarddeduction: z.number().optional(),
    }),
  ),
});
