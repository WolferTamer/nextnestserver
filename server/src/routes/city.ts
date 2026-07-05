//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so
//that each route has its own.

import { Request, Response } from "express";

const { sequelize } = require("../db");
const Sequelize = require("sequelize");

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
export const get = {
  route: "/api/city",
  execute: async (req: Request, res: Response) => {
    const city = sequelize.models.city;
    let cities;

    if (req.query.id) {
      cities = await city.findAll({
        where: {
          id: req.query.id,
        },
      });
    } else if (req.query.name) {
      cities = await city.findAll({
        where: {
          name: {
            [Sequelize.Op.like]: `%${req.query.name}%`,
          },
        },
      });
    } else {
      cities = await city.findAll();
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
