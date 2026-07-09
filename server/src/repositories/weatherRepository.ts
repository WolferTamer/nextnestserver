import { PrismaClientKnownRequestError } from "@prisma/client/runtime/wasm-compiler-edge";
import { prisma } from "../lib/prisma";
import {
  ERR,
  isErrorWithMessage,
  parsePrismaError,
} from "../utils/errorGuards";
import { WeatherRepository } from "./repoTypes";

export const weatherRepository: WeatherRepository = {
  async findByCityId(cityId) {
    try {
      const weather = await prisma.weather.findFirst({
        where: { cityId: cityId },
      });
      return weather;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async editByCityId(cityId, data) {
    try {
      const weather = await prisma.weather.update({
        where: { cityId: cityId },
        data: data,
      });
      return weather;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async upsertByCityId(cityId, create, update) {
    try {
      const weather = await prisma.weather.upsert({
        where: { cityId: cityId },
        create: create,
        update: update,
      });
      return weather;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
};
