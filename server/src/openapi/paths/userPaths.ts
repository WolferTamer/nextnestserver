import { authResponseSchema } from "../../validators/authValidator";
import {
  createUserBody,
  getManyUsersQuery,
  getUserByIdParams,
  manyUserResponseSchema,
  updateUserBody,
  updateUserQuery,
  userResponseSchema,
} from "../../validators/userValidors";
import { registry } from "../registry";

registry.registerPath({
  method: "get",
  path: "/api/user/{id}",
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  request: { params: getUserByIdParams },
  description: "Get user information by ID, admins only",
  responses: {
    201: {
      description: "Found the user",
      content: { "application/json": { schema: userResponseSchema } },
    },
    400: { description: "Invalid param" },
    403: { description: "Forbidden, requries ADMIN role" },
    404: { description: "User not found" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/user/me",
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  description: "Gets your own user information",
  responses: {
    201: {
      description: "Found the user",
      content: { "application/json": { schema: userResponseSchema } },
    },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/user",
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  description: "Gets a list of users",
  request: { params: getManyUsersQuery },
  responses: {
    201: {
      description: "List of users",
      content: { "application/json": { schema: manyUserResponseSchema } },
    },
    400: { description: "Invalid query option" },
    403: { description: "Forbidden, requries ADMIN role" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/user",
  tags: ["User"],
  description: "Creates a user",
  request: {
    body: { content: { "application/json": { schema: createUserBody } } },
  },
  responses: {
    201: {
      description: "Authorization",
      content: { "application/json": { schema: authResponseSchema } },
    },
    400: { description: "Invalid body" },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/user",
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  description: "updates the salary of a user",
  request: {
    body: { content: { "application/json": { schema: updateUserBody } } },
    query: updateUserQuery,
  },
  responses: {
    201: {
      description: "The updated user",
      content: { "application/json": { schema: userResponseSchema } },
    },
    400: { description: "Invalid body" },
    401: { description: "unauthorized" },
  },
});
