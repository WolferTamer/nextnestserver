import {
  authResponseSchema,
  loginBodySchema,
} from "../../validators/authValidator";
import { registry } from "../registry";

registry.registerPath({
  method: "post",
  path: "/api/auth",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: loginBodySchema } } },
  },
  description: "Logs the user in.",
  responses: {
    201: {
      description: "Successfully Logged In",
      content: { "application/json": { schema: authResponseSchema } },
    },
    401: { description: "Incorrect Login" },
    400: { description: "Invalid body" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/refresh",
  tags: ["Auth"],
  security: [{ refreshTokenCookie: [] }],
  description: "Gets a new auth token using a refresh token.",
  responses: {
    200: {
      description: "Successfully Refreshed Token",
      content: { "application/json": { schema: authResponseSchema } },
    },
    401: { description: "Invalid or missing refresh token" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/logout",
  tags: ["Auth"],
  security: [{ refreshTokenCookie: [] }],
  description: "Revokes the current session.",
  responses: {
    200: {
      description: "Successfully Logged Out",
    },
    401: { description: "Invalid or missing refresh token" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/logout-all",
  tags: ["Auth"],
  security: [{ refreshTokenCookie: [] }],
  description: "Revokes all sessions associated with the user.",
  responses: {
    200: {
      description: "Successfully Logged Out All Sessions",
    },
    401: { description: "Invalid or missing refresh token" },
  },
});
