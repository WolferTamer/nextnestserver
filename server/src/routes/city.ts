//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so
//that each route has its own.

import { Request, Response } from "express";
import { City } from "../types";
import { userRepository } from "../repositories/userRepository";
import { isErr } from "../utils/errorGuards";
import { cityRepository } from "../repositories/cityRepository";

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
export const get = {
  route: "/api/city",
  execute: async (req: Request, res: Response) => {
    let cities: City[];

    if (req.query.id) {
      const r = await cityRepository.findById(Number(req.query.id));
      if (isErr(r) || !r) cities = [];
      else cities = [r];
    } else if (req.query.name) {
      const r = await cityRepository.findByLike(`%${req.query.name}%`);
      if (isErr(r)) cities = [];
      else cities = r;
    } else {
      const r = await cityRepository.getAll();
      if (isErr(r)) cities = [];
      else cities = r;
    }

    if (cities.length < 1) {
      res.status(404).json({
        error: "No city of that name or id found.",
      });
      return;
    }
    res.json({ cities: cities });
  },
};
