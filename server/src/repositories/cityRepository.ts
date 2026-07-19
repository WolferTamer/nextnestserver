import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma";
import {
  Err,
  ERR,
  isErrorWithMessage,
  parsePrismaError,
} from "../utils/errorGuards";
import { CityRepository } from "./repoTypes";
import { City, User } from "../types";
import {
  cityFindManyArgs,
  cityGetPayload,
  cityInclude,
} from "../generated/prisma/models";

export const cityRepository: CityRepository = {
  async findById<T extends cityInclude = {}>(
    id: number,
    include?: T,
  ): Promise<cityGetPayload<{ include: T }> | null | Err> {
    try {
      const city = await prisma.city.findUnique({
        where: {
          id: id,
        },
      });
      return city as cityGetPayload<{ include: T }> | null;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByLike(query) {
    try {
      const cities = await prisma.city.findMany({
        where: {
          name: {
            contains: query,
          },
        },
      });
      return cities;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async search<T extends cityInclude = {}>(
    query: cityFindManyArgs,
  ): Promise<cityGetPayload<{ include: T }>[] | Err> {
    try {
      const cities = await prisma.city.findMany(query);
      return cities as cityGetPayload<{ include: T }>[];
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByState<T extends cityInclude = {}>(
    state: string,
    include: T,
  ): Promise<cityGetPayload<{ include: T }>[] | Err> {
    try {
      const city = await prisma.city.findMany({
        where: {
          state: state,
        },
        include,
      });
      return city as cityGetPayload<{ include: T }>[];
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async create(data) {
    try {
      const newCity = await prisma.city.create({ data: data });
      return newCity;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async getAll<T extends cityInclude = {}>(
    include?: T,
  ): Promise<cityGetPayload<{ include: T }>[] | Err> {
    try {
      const city = await prisma.city.findMany({ include });
      return city as cityGetPayload<{ include: T }>[];
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async upsertById(id, create, update) {
    try {
      const updatedCity = await prisma.city.upsert({
        where: { id: id },
        create: create,
        update: update,
      });
      return updatedCity;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async upsertMany(data) {
    const promises: Promise<City>[] = [];
    try {
      const res = await prisma.$transaction(
        data.map((row) =>
          row.id == -1
            ? prisma.city.create({ data: row.create })
            : prisma.city.update({ where: { id: row.id }, data: row.update }),
        ),
      );
      return res;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async deleteById(id) {
    try {
      await prisma.city.delete({
        where: { id: id },
      });
    } catch (e) {
      return parsePrismaError(e);
    }
  },
};
