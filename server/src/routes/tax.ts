import { Router } from "express";
import {
  getAllTaxesService,
  getTaxByCityIdService,
} from "../services/taxService";

const taxRouter = Router();

taxRouter.get("/", async (req, res) => {
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
});

//TODO: Add params and results that correspond to city IDs and name/states

export default taxRouter;
