//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so
//that each route has its own.

import { Request, Response } from "express";
import {
  cityInclude,
  cityWhereInput,
  taxSelect,
  taxWhereInput,
  weatherSelect,
  weatherWhereInput,
} from "../generated/prisma/models";
import { incomeTaxRepository } from "../repositories/incometaxRepository";
import { isErr } from "../utils/errorGuards";
import { IncomeTax } from "../types";

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

//PARAMS: name (optional string), weather (optional number using bit info)
//RESULTS: All cities that contain the name string and match weather preferences
export const get = {
  route: "/api/search",
  execute: async (req: Request, res: Response) => {
    let query: { include: cityInclude; where?: cityWhereInput } = {
      include: {},
    };

    const name = req.query.name;
    const weatherbinary = req.query.weather;
    const salestax = parseFloat(req.query.salestax as string);
    const allowlocal =
      typeof req.query.localtax === "string"
        ? !(req.query.localtax.toLowerCase() === "false")
        : true;
    const salary = parseInt(req.query.salary as string);
    const maxincome = parseFloat(req.query.maxincome as string);
    const married =
      typeof req.query.married === "string"
        ? req.query.married.toLowerCase() === "true"
        : false;

    //Must have at least one search method
    if (
      !name &&
      !weatherbinary &&
      !salestax &&
      !salary &&
      !maxincome &&
      allowlocal == undefined
    ) {
      res.status(400).json({
        error: "No search parameters provided.",
      });
      return;
    }

    if (name) {
      if (typeof name !== "string") {
        res.status(400).json({
          error: "Name must be string",
        });
        return;
      }
      query.where = {
        name: {
          contains: `%${req.query.name}%`,
        },
      };
    }
    if (weatherbinary) {
      if (isNaN(Number(weatherbinary))) {
        res.status(400).json({
          error: "Weather must be a number of value 1-255",
        });
        return;
      }
      // Weather binary takes in an integer which can be broken down by 2 bits at a time
      // Summer Temp (Bits 1 & 2): 0 - No Preference, 1 - Cool, 2 - Moderate, 3 - Hot
      // Winter Temp (Bits 3 & 4): 0 - No Preference, 1 - Cold, 2 - Moderate, 3 - Warm
      // Rain Preference (Bits 5 & 6): 0 - No Preference, 1 - Little Rain, 2 - Moderate Rain, 3 - Lots of Rain
      // Humidity (Bits 7 & 8): 0 - No Preference, 1 - Not Humid, 2 - Average, 3 - Very Humid
      // Using this system instead of individual params will save on communicaiton time
      query.include.weather = convertWeather(Number(weatherbinary));
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
        if (typeof salestax !== "number") {
          res.status(400).json({
            error: "Sales Tax must be a number",
          });
          return;
        } else {
          taxQuery.select.salestax = true;
          taxQuery.where["salestax"] = { lt: salestax };
        }
      }

      if (typeof allowlocal !== "undefined") {
        if (typeof allowlocal !== "boolean") {
          res.status(400).json({
            error: "Local tax must be a boolean",
          });
          return;
        } else if (!allowlocal) {
          taxQuery.select.localtaxes = true;
          taxQuery.where.OR = [
            { localtaxes: { equals: null } },
            { localtaxes: { equals: false } },
          ];
        }
      }
      query.include.tax = taxQuery;
    }
    let income: { [key: string]: IncomeTax } = {};
    if (maxincome && typeof salary !== "undefined") {
      if (typeof maxincome !== "number" && typeof salary !== "number") {
        res.status(400).json({
          error: "Max Income and Salary must be numbers and both be provided",
        });
        return;
      } else {
        //Find Income tax of same state, highest income tax without being greater than salary,
        //and the rate is lower than maxincome while matching married/unmarried. Include if there
        //is no income for the state.
        let it = await incomeTaxRepository.findByLt(maxincome, married);
        if (!isErr(it)) {
          for (let state of it) {
            const key = state.state;
            if (!income[key] || income[key]!.bracket! < state.bracket!) {
              income[key] = state;
            }
          }
        }
      }
    }

    let cities = await city.findAll(query);
    if (Object.keys(income).length > 0) {
      for (let i = 0; i < cities.length; i++) {
        let state = cities[i].state;
        if (income[state] && income[state].rate > maxincome) {
          cities.splice(i, 1);
          i--;
        } else if (income[state]) {
          cities[i].dataValues.incometax = income[state];
        } else {
          cities[i].dataValues.incometax = {
            bracket: 0,
            rate: 0,
            married: married,
          };
        }
      }
    }

    res.json({ cities: cities, incometax: income });
  },
};
