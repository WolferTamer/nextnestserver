import {
  getTaxQuery,
  taxesResponse,
  taxResponse,
} from "../../validators/taxValidator";
import { registry } from "../registry";

registry.registerPath({
  method: "get",
  path: "/api/tax",
  tags: ["Tax"],
  description: "Gets a list of taxes",
  responses: {
    200: {
      description: "A list of taxes",
      content: { "application/json": { schema: taxesResponse } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/tax/id",
  tags: ["Tax"],
  request: {
    params: getTaxQuery,
  },
  description: "Gets the tax of a city with the provided ID",
  responses: {
    200: {
      description: "The taxes of the city",
      content: { "application/json": { schema: taxResponse } },
    },
    404: {
      description: "Tax not found",
    },
  },
});
