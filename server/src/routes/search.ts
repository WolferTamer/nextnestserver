//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so
//that each route has its own.

import { Router } from "express";
import { validatedRoute } from "../middleware/validate";
import { searchValidator } from "../validators/searchValidator";
import { searchService } from "../services/searchService";

const searchRouter = Router();

//PARAMS: name (optional string), weather (optional number using bit info)
//RESULTS: All cities that contain the name string and match weather preferences
searchRouter.get(
  "/",
  ...validatedRoute(searchValidator, async (req, res) => {
    let cities = await searchService(req.validated.query);

    res.json(cities);
  }),
);

export default searchRouter;
