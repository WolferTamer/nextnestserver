import { Router } from "express";
import {
  getAllTaxesService,
  getTaxByCityIdService,
} from "../services/taxService";
import { validatedRoute } from "../middleware/validate";
import { getTaxValidator } from "../validators/taxValidator";

const taxRouter = Router();

taxRouter.get("/", async (req, res) => {
  const weather = await getAllTaxesService();
  res.json({ weather: weather });
});

taxRouter.get(
  "/city/:id",
  ...validatedRoute(getTaxValidator, async (req, res) => {
    const weather = await getTaxByCityIdService(req.validated.query.id);
    res.json({ weather: weather });
  }),
);

//TODO: Add params and results that correspond to city IDs and name/states

export default taxRouter;
