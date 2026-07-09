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
import { cityGetPayload, cityInclude } from "../generated/prisma/models";

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
      const cities = await prisma.$queryRaw<City[]>`
        SELECT * from "city" WHERE "name" LIKE '${query}' LIMIT 10;`;
      return cities;
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
      for (const d of data) {
        promises.push(
          prisma.city.upsert({
            where: { id: d.id },
            update: d.update,
            create: d.create,
          }),
        );
      }
      const res = await Promise.all(promises);
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
