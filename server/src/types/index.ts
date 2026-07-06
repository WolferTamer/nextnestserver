import {
  cityGetPayload,
  userGetPayload,
  weatherGetPayload,
} from "../generated/prisma/models";

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

export type Weather = weatherGetPayload<{}>;

export type WeatherDto = weatherGetPayload<{}>;

export type City = cityGetPayload<{}>;
export type CityDto = cityGetPayload<{}>;
