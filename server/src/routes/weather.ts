import { Router } from "express";
import {
  getAllWeatherService,
  getWeatherByCityIdService,
} from "../services/weatherService";

const weatherRouter = Router();

weatherRouter.get("/", async (req, res) => {
  if (req.query.id) {
    const weather = await getWeatherByCityIdService(Number(req.query.id));
    res.json({ weather: weather });
  } else {
    const weather = await getAllWeatherService();
    res.json({ weather: weather });
  }
});

export default weatherRouter;
