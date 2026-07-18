import {
  cityCreateInput,
  cityGetPayload,
  cityInclude,
  cityUpdateInput,
  incometaxCreateInput,
  sessionCreateInput,
  taxCreateInput,
  taxUpdateInput,
  userCreateInput,
  userUpdateInput,
  weatherCreateInput,
  weatherUpdateInput,
} from "../generated/prisma/models";
import {
  City,
  IncomeTax,
  Session,
  Tax,
  User,
  UserWithPassword,
  Weather,
} from "../types";
import { Err } from "../utils/errorGuards";

export interface UserRepository {
  findById(id: number): Promise<User | null | Err>;
  findByEmailIncludePassword(
    email: string,
  ): Promise<UserWithPassword | null | Err>;
  getAll(): Promise<User[] | Err>;
  create(data: userCreateInput): Promise<User | Err>;
  editById(id: number, data: userUpdateInput): Promise<User | Err>;
  deleteById(id: number): Promise<void | Err>;
}

export interface WeatherRepository {
  getAll(): Promise<Weather[] | null | Err>;
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
  findById<T extends cityInclude = {}>(
    id: number,
    include?: T,
  ): Promise<cityGetPayload<{ include: T }> | null | Err>;
  findByLike(query: string): Promise<City[] | Err>;
  findByState<T extends cityInclude = {}>(
    state: string,
    include: T,
  ): Promise<cityGetPayload<{ include: T }>[] | null | Err>;
  getAll<T extends cityInclude = {}>(
    include?: T,
  ): Promise<cityGetPayload<{ include: T }>[] | Err>;
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

export interface TaxRepositoty {
  findByCityId(cityid: number): Promise<Tax | null | Err>;
  getAll(): Promise<Tax[] | Err>;
  create(data: taxCreateInput): Promise<Tax | Err>;
  upsertByCityId(
    cityid: number,
    create: taxCreateInput,
    update: taxUpdateInput,
  ): Promise<Tax | Err>;
}

export interface IncomeTaxRepository {
  getAll(): Promise<IncomeTax[] | Err>;
  findByLt(income: number, married?: boolean): Promise<IncomeTax[] | Err>;
  findByState(state: string): Promise<IncomeTax[] | Err>;
  replace(state: string, taxes: incometaxCreateInput[]): Promise<number | Err>;
  bulkReset(newTaxes: incometaxCreateInput[]): Promise<number | Err>;
  findByStateLt(
    state: string,
    income: number,
    married?: boolean,
  ): Promise<IncomeTax[] | Err>;
}

export interface SessionRepository {
  findByUserId(id: number): Promise<Session[] | Err>;
  findById(id: number): Promise<Session | null | Err>;
  create(data: sessionCreateInput): Promise<Session | Err>;
  revoke(session: Session): Promise<void | Err>;
  revokeFamily(session: Session): Promise<number | Err>;
  replace(
    oldSession: number,
    newSession: sessionCreateInput,
  ): Promise<Session | Err>;
}
