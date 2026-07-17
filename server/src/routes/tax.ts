import { Router } from "express";
import {
  getAllTaxesService,
  getTaxByCityIdService,
} from "../services/taxService";
import { validatedRoute } from "../middleware/validate";
import { getTaxValidator } from "../validators/taxValidator";

const taxRouter = Router();

taxRouter.get(
  "/",
  ...validatedRoute(getTaxValidator, async (req, res) => {
    if (req.validated.query.id) {
      const tax = await getTaxByCityIdService(req.validated.query.id);
      res.json({
        tax: tax,
      });
    } else {
      const taxes = await getAllTaxesService();
      res.json({
        taxes: taxes,
      });
    }
  }),
);

//TODO: Add params and results that correspond to city IDs and name/states

export default taxRouter;
