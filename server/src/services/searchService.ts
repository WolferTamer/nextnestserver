import { keyof } from "zod/mini";
import { NotFoundError } from "../errors";
import {
  cityFindManyArgs,
  taxSelect,
  taxWhereInput,
  weatherSelect,
  weatherWhereInput,
} from "../generated/prisma/models";
import { cityRepository } from "../repositories/cityRepository";
import { incomeTaxRepository } from "../repositories/incometaxRepository";
import { IncomeTax } from "../types";
import { isErr } from "../utils/errorGuards";

const convertWeather = (options: number) => {
  let weather: {
    select: weatherSelect;
    where: weatherWhereInput;
  } = { select: {}, where: {} };
  let summer = options % 4;
  if (summer > 0) {
    //Considered cold if less than 15 degrees celcius, hot if above 27 degrees celcius
    weather.select.julytemp = true;
    weather.where["julytemp"] =
      summer == 1
        ? { lt: 292 }
        : summer == 3
          ? { gt: 300 }
          : { lt: 300, gt: 292 };
  }
  options = Math.floor(options / 4);
  const winter = options % 4;
  if (winter > 0) {
    //Considered cold if less than -1 degrees celcius, warm if above 11 degrees celcius
    weather.select.jantemp = true;
    weather.where["jantemp"] =
      winter == 1
        ? { lt: 272 }
        : winter == 3
          ? { gt: 284 }
          : { lt: 284, gt: 272 };
  }
  options = Math.floor(options / 4);
  const rain = options % 4;
  if (rain > 0) {
    //Considered little if less than 0.05m of precipitation , lots if above 0.09
    weather.select.julyprecipitation = true;
    weather.where["julyprecipitation"] =
      rain == 1
        ? { lt: 0.5 }
        : rain == 3
          ? { gt: 0.09 }
          : { lt: 0.09, gt: 0.05 };
  }
  options = Math.floor(options / 4);
  const humidity = options % 4;
  if (humidity > 0) {
    //Considered little if less than 70% humidity, lots if above 80
    weather.select.julyhumidity = true;
    weather.where["julyhumidity"] =
      humidity == 1
        ? { lt: 70 }
        : humidity == 3
          ? { gt: 80 }
          : { lt: 80, gt: 70 };
  }
  return weather;
};

export const searchService = async (input: {
  name?: string;
  weather?: number;
  salestax?: number;
  allowlocal?: boolean;
  salary?: number;
  maxincome?: number;
  married: boolean;
}) => {
  let query: cityFindManyArgs = {};
  query.where = {};
  query.include = {};

  const name = input.name;
  const weatherbinary = input.weather;
  const salestax = input.salestax;
  const allowlocal = input.allowlocal;
  const salary = input.salary;
  const maxincome = input.maxincome;
  const married = input.married;
  if (name) {
    query.where.name = {
      contains: `%${name}%`,
    };
  }
  if (weatherbinary) {
    // Weather binary takes in an integer which can be broken down by 2 bits at a time
    // Summer Temp (Bits 1 & 2): 0 - No Preference, 1 - Cool, 2 - Moderate, 3 - Hot
    // Winter Temp (Bits 3 & 4): 0 - No Preference, 1 - Cold, 2 - Moderate, 3 - Warm
    // Rain Preference (Bits 5 & 6): 0 - No Preference, 1 - Little Rain, 2 - Moderate Rain, 3 - Lots of Rain
    // Humidity (Bits 7 & 8): 0 - No Preference, 1 - Not Humid, 2 - Average, 3 - Very Humid
    // Using this system instead of individual params will save on communicaiton time
    const weatherQ = convertWeather(Number(weatherbinary));
    query.include.weather = weatherQ;
    query.where.weather = { some: weatherQ.where };
  }

  if (salestax || typeof allowlocal !== "undefined") {
    let taxQuery: {
      select: taxSelect;
      where: taxWhereInput;
    } = {
      select: {},
      where: {},
    };
    if (salestax) {
      taxQuery.select.salestax = true;
      taxQuery.where["salestax"] = { lt: salestax };
    }

    if (typeof allowlocal !== "undefined") {
      taxQuery.select.localtaxes = true;
      taxQuery.where.OR = [
        { localtaxes: { equals: null } },
        { localtaxes: { equals: false } },
      ];
    }
    query.include.tax = taxQuery;
  }
  let income: { [key: string]: IncomeTax } = {};
  if (maxincome && typeof salary !== "undefined") {
    //Find Income tax of same state, highest income tax without being greater than salary,
    //and the rate is lower than maxincome while matching married/unmarried. Include if there
    //is no income for the state.
    let it = await incomeTaxRepository.findByLt(salary, married);
    if (!isErr(it)) {
      for (let state of it) {
        const key = state.state;
        if (!income[key] || income[key]!.bracket! < state.bracket!) {
          income[key] = state;
        }
      }
    }
  }

  if (query.include.tax && query.include.tax !== true) {
    if (query.include.tax.where) {
      query.where.tax = { some: query.include.tax.where };
    }
  }

  let cities = await cityRepository.search(query, query.include);
  if (isErr(cities)) {
    throw new NotFoundError();
  }
  if (salary && maxincome) {
    for (const [key, value] of Object.entries(income)) {
      if (
        value.married == married &&
        (!value.bracket || value.bracket <= salary) &&
        value.rate > maxincome
      ) {
        cities = cities.filter((v) => v.state !== key);
        delete income[key];
      }
    }
  }

  return { cities: cities, incometax: income };
};
