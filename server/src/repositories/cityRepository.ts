import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma";
import { ERR, isErrorWithMessage } from "../utils/errorGuards";
import { CityRepository } from "./repoTypes";
import { City, User } from "../types";

export const cityRepository: CityRepository = {
  async findById(id) {
    try {
      const city = await prisma.city.findUnique({
        where: {
          id: id,
        },
      });
      return city;
    } catch (e) {
      let error: string = "";
      if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
    }
  },
  async findByLike(query) {
    try {
      const cities = await prisma.$queryRaw<City[]>`
        SELECT * from "city" WHERE "name" LIKE '${query}' LIMIT 10;`;
      return cities;
    } catch (e) {
      let error: string = "";
      if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
    }
  },
  async create(data) {
    try {
      const newCity = await prisma.city.create({ data: data });
      return newCity;
    } catch (e) {
      let error: string = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          error = "That city already has";
        } else {
          error = e.message;
        }
      } else if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
    }
  },
  async getAll() {
    try {
      const city = await prisma.city.findMany();
      return city;
    } catch (e) {
      let error: string = "";
      if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
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
      let error = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          error = "That city doesn't exist";
        } else if (e.code === "P2002") {
          error = "That city is already in use";
        } else {
          error = e.message;
        }
      } else if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
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
      let error = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          error = "That cityy doesn't exist";
        } else {
          error = e.message;
        }
      } else if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
    }
  },
  async deleteById(id) {
    try {
      await prisma.city.delete({
        where: { id: id },
      });
    } catch (e) {
      let error = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          error = "That cityy doesn't exist";
        } else {
          error = e.message;
        }
      } else if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
    }
  },
};
