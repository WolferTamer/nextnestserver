import {
  cityCreateInput,
  cityUpdateInput,
  userCreateInput,
  userUpdateInput,
  weatherCreateInput,
  weatherUpdateInput,
} from "../generated/prisma/models";
import { City, User, UserWithPassword, Weather } from "../types";
import { Err } from "../utils/errorGuards";

export interface UserRepository {
  findById(id: number): Promise<User | null | Err>;
  findByIdIncludePassword(id: number): Promise<UserWithPassword | null | Err>;
  getAll(): Promise<User[] | Err>;
  create(data: userCreateInput): Promise<User | Err>;
  editById(id: number, data: userUpdateInput): Promise<User | Err>;
  deleteById(id: number): Promise<void | Err>;
}

export interface WeatherRepository {
  findByCityId(cityId: number): Promise<Weather | null | Err>;
  editByCityId(
    cityId: number,
    data: weatherUpdateInput,
  ): Promise<Weather | Err>;
  upsertByCityId(
    cityId: number,
    create: weatherCreateInput,
    update: weatherUpdateInput,
  ): Promise<Weather | Err>;
}

export interface CityRepository {
  findById(id: number): Promise<City | null | Err>;
  findByLike(query: string): Promise<City[] | Err>;
  getAll(): Promise<City[] | Err>;
  create(data: cityCreateInput): Promise<City | Err>;
  upsertMany(
    data: { id: number; create: cityCreateInput; update: cityUpdateInput }[],
  ): Promise<City[] | Err>;
  upsertById(
    id: number,
    create: cityCreateInput,
    update: cityUpdateInput,
  ): Promise<City | Err>;
  deleteById(id: number): Promise<void | Err>;
}
