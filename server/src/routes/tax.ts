import { Request, Response } from "express";
import { Tax } from "../types";
import { taxRepository } from "../repositories/taxRepository";
import { isErr } from "../utils/errorGuards";
import {
  getAllTaxesService,
  getTaxByCityIdService,
} from "../services/taxService";

//TODO: Add params and results that correspond to city IDs and name/states
export const get = {
  route: "/api/tax",
  execute: async (req: Request, res: Response) => {
    if (req.query.id) {
      const tax = await getTaxByCityIdService(Number(req.query.id));
      res.json({
        tax: tax,
      });
    } else {
      const taxes = await getAllTaxesService();
      res.json({
        taxes: taxes,
      });
    }
  },
};
