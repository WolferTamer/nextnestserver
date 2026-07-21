import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import "./paths/authPaths";
import "./paths/userPaths";
import "./paths/cityPaths";
import "./paths/taxPaths";
import "./paths/weatherPaths";
export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: { title: "Next Nest API", version: "1.0.0" },
    servers: [{ url: "/api/v1" }],
  });
}
