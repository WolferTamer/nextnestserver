import { userGetPayload } from "../generated/prisma/models";

export type UserDto = userGetPayload<{
  select: {
    userid: true;
    email: true;
    username: true;
    salary: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type User = userGetPayload<{
  select: {
    userid: true;
    email: true;
    username: true;
    salary: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type UserWithPassword = userGetPayload<{}>;
