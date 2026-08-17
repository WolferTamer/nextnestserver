//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so
//that each route has its own.

import { Router } from "express";
import { getCityService, getManyCitiesService } from "../services/cityService";
import { validatedRoute } from "../middleware/validate";
import {
  getCityValidator,
  getManyCitiesValidator,
} from "../validators/cityValidator";

const cityRouter = Router();

cityRouter.get(
  "/",
  ...validatedRoute(getManyCitiesValidator, async (req, res) => {
    const { name, taxes, weather } = req.validated.query;

    const cities = await getManyCitiesService(name, {
      taxes: taxes,
      weather: weather,
    });
    res.json({ cities: cities });
  }),
);

cityRouter.get(
  "/:id",
  validatedRoute(getCityValidator, async (req, res) => {
    const { id } = req.validated.params;
    const { taxes, weather } = req.validated.query;

    const city = await getCityService(id, { taxes: taxes, weather: weather });
    res.json({ city: city });
  }),
);

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
export default cityRouter;
