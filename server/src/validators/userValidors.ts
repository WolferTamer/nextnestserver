import { z } from "../lib/zod.js";

export const createUserBody = z
  .object({
    email: z.email(),
    username: z.string().min(1).max(255),
    password: z.string().min(8).max(20),
  })
  .openapi("CreateUserBody");
export const createUserSchema = z.object({
  body: createUserBody,
});

export const getUserByIdParams = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi("GetUserByIdParams");
export const getUserByIdSchema = z.object({
  params: getUserByIdParams,
});

export const getManyUsersQuery = z
  .object({
    name: z.string().optional(),
  })
  .openapi("GetManyUsersQuery");
export const getManyUsersSchema = z.object({
  query: getManyUsersQuery,
});

export const updateUserQuery = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi("UpdateUserQuery");
export const updateUserBody = z
  .object({
    salary: z.number().int().positive(),
  })
  .openapi("UpdateUserBody");
export const updateUserSchema = z.object({
  query: updateUserQuery,
  body: updateUserBody,
});

export const userResponseSchema = z
  .object({
    user: z.object({
      userid: z.number().int().positive(),
      email: z.email(),
      role: z.enum(["USER", "ADMIN"]),
      username: z.string(),
      salary: z.number().int().positive().optional(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  })
  .openapi("UserResponse");

export const manyUserResponseSchema = z
  .object({
    users: z.array(
      z.object({
        userid: z.number().int().positive(),
        email: z.email(),
        role: z.enum(["USER", "ADMIN"]),
        username: z.string(),
        salary: z.number().int().positive().optional(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  })
  .openapi("ManyUsersResponse");
