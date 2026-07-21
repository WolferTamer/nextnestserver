import {
  getWeatherQuery,
  manyWeatherResponse,
  weatherResponse,
} from "../../validators/weatherValidator";
import { registry } from "../registry";

registry.registerPath({
  method: "get",
  path: "/api/weather",
  tags: ["Weather"],
  description: "Gets a list of weather",
  responses: {
    200: {
      description: "A list of weather",
      content: { "application/json": { schema: weatherResponse } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/weather",
  tags: ["Weather"],
  request: {
    params: getWeatherQuery,
  },
  description: "Gets the weather of a city with the provided ID",
  responses: {
    200: {
      description: "The weather of the city",
      content: { "application/json": { schema: manyWeatherResponse } },
    },
    404: {
      description: "Tax not found",
    },
  },
});
