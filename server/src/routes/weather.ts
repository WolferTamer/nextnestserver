import { Router } from "express";
import {
  getAllWeatherService,
  getWeatherByCityIdService,
} from "../services/weatherService";
import { validatedRoute } from "../middleware/validate";
import { getWeatherValidator } from "../validators/weatherValidator";

const weatherRouter = Router();

weatherRouter.get(
  "/",
  ...validatedRoute(getWeatherValidator, async (req, res) => {
    if (req.validated.query.id) {
      const weather = await getWeatherByCityIdService(req.validated.query.id);
      res.json({ weather: weather });
    } else {
      const weather = await getAllWeatherService();
      res.json({ weather: weather });
    }
  }),
);

export default weatherRouter;
