import { Request, Response } from "express";
import { sequelize } from "../db";
import { Op } from "sequelize";

//TODO: Add params and results that correspond to city IDs and name/states
export const get = {
  route: "/api/tax",
  execute: async (req: Request, res: Response) => {
    const tax = sequelize.models.tax;
    let taxes;

    if (req.query.id) {
      taxes = await tax.findAll({
        where: {
          cityId: req.query.id,
        },
      });
    } else if (req.query.name) {
      taxes = await tax.findAll({
        where: {
          name: {
            [Op.like]: `%${req.query.name}%`,
          },
        },
      });
    } else {
      taxes = await tax.findAll();
    }

    if (taxes.length < 1) {
      res.status(404).json({
        error: "No city of that name or id found.",
      });
      return;
    }
    res.json({ taxes: taxes });
  },
};
