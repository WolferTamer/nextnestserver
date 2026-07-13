import { Request, Response } from "express";
import { weatherRepository } from "../repositories/weatherRepository";
import { isErr } from "../utils/errorGuards";
import { getWeatherByCityIdService } from "../services/weatherService";

export const get = {
  route: "/api/weather",
  execute: async (req: Request, res: Response) => {
    if (req.query.id) {
      const weather = await getWeatherByCityIdService(Number(req.query.id));
      res.json({ weather: weather });
    } else {
      const weather = await weatherRepository.getAll();
      res.json({ weather: weather });
    }
  },
};
