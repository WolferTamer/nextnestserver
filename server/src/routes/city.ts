//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so
//that each route has its own.

import { Request, Response, Router } from "express";
import { getCityService, getManyCitiesService } from "../services/cityService";

const cityRouter = Router();

cityRouter.get("/", async (req: Request, res: Response) => {
  if (req.query.id) {
    const city = await getCityService(Number(req.query.id));
    res.json({ city: city });
  } else {
    const cities = await getManyCitiesService(
      req.query.name as string | undefined,
    );
    res.json({ cities: cities });
  }
});

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
export default cityRouter;
