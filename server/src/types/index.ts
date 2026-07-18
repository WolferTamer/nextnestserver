import {
  cityGetPayload,
  incometaxGetPayload,
  taxGetPayload,
  userGetPayload,
  weatherGetPayload,
} from "../generated/prisma/models";

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UserDto = userGetPayload<{
  select: {
    userid: true;
    email: true;
    role: true;
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
    role: true;
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
export type CityWithOptionalRelations = WithOptional<
  cityGetPayload<{ include: { tax: true; weather: true } }>,
  "tax" | "weather"
>;
export type CityDto = cityGetPayload<{}>;

export type Tax = taxGetPayload<{}>;
export type TaxDto = taxGetPayload<{}>;

export type IncomeTax = incometaxGetPayload<{}>;
export type IncomeTaxDto = incometaxGetPayload<{}>;

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthDto = {
  auth: string;
  user: {
    userid: number;
    username: string;
  };
};

export type Session = {
  userid: number;
  createdAt: Date;
  id: number;
  refreshHash: string;
  userAgent: string | null;
  ip: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedBy: number | null;
};
