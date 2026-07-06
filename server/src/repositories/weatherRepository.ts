import { PrismaClientKnownRequestError } from "@prisma/client/runtime/wasm-compiler-edge";
import { prisma } from "../lib/prisma";
import { ERR, isErrorWithMessage } from "../utils/errorGuards";
import { WeatherRepository } from "./repoTypes";

export const weatherRepository: WeatherRepository = {
  async findByCityId(cityId) {
    try {
      const weather = await prisma.weather.findFirst({
        where: { cityId: cityId },
      });
      return weather;
    } catch (e) {
      if (isErrorWithMessage(e)) {
        return {
          [ERR]: true,
          error: e.message,
        };
      }
      return {
        [ERR]: true,
        error: "Unknown error occured.",
      };
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
      let error = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          error = "Weather does not exist for this city.";
        } else if (e.code === "P2002") {
          error = "That city already has weather.";
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
  async upsertByCityId(cityId, create, update) {
    try {
      const weather = await prisma.weather.upsert({
        where: { cityId: cityId },
        create: create,
        update: update,
      });
      return weather;
    } catch (e) {
      let error = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          error = "Weather does not exist for this city.";
        } else if (e.code === "P2002") {
          error = "That city already has weather.";
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
