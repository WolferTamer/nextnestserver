import { Request, Response } from "express";
import { Tax } from "../types";
import { taxRepository } from "../repositories/taxRepository";
import { isErr } from "../utils/errorGuards";

//TODO: Add params and results that correspond to city IDs and name/states
export const get = {
  route: "/api/tax",
  execute: async (req: Request, res: Response) => {
    let taxes: Tax[];

    if (req.query.id) {
      const temp = await taxRepository.findByCityId(Number(req.query.id));
      if (isErr(temp) || !temp) taxes = [];
      else taxes = [temp];
    } else {
      const temp = await taxRepository.getAll();
      if (isErr(temp)) taxes = [];
      else taxes = temp;
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
