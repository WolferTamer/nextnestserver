import { Request, Response } from "express";
import { weatherRepository } from "../repositories/weatherRepository";
import { isErr } from "../utils/errorGuards";

export const get = {
  route: "/api/weather",
  execute: async (req: Request, res: Response) => {
    let data;

    if (req.query.id) {
      data = await weatherRepository.findByCityId(Number(req.query.id));
    } else {
      data = await weatherRepository.getAll();
    }

    if (isErr(data) || !data) {
      res.status(404).json({
        error: "No city of that name or id found.",
      });
      return;
    }
    res.json({ weather: data });
  },
};
