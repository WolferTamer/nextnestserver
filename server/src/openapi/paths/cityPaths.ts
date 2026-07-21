import {
  cityResponse,
  getCityParams,
  getManyCitiesQuery,
  manyCitiesResponse,
} from "../../validators/cityValidator";
import { registry } from "../registry";

registry.registerPath({
  method: "get",
  path: "/api/city",
  tags: ["City"],
  request: {
    query: getManyCitiesQuery,
  },
  description: "Gets a list of cities that matches the provided name",
  responses: {
    200: {
      description: "A list of cities",
      content: { "application/json": { schema: manyCitiesResponse } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/city/id",
  tags: ["City"],
  request: {
    params: getCityParams,
  },
  description: "Gets a city of the provided ID",
  responses: {
    200: {
      description: "The city",
      content: { "application/json": { schema: cityResponse } },
    },
    404: {
      description: "City not found",
    },
  },
});
