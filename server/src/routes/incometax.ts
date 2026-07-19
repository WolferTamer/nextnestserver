import jwt, { JwtPayload } from "jsonwebtoken";
import { Router } from "express";
import { incomeTaxRepository } from "../repositories/incometaxRepository";
import { isErr } from "../utils/errorGuards";
import { IncomeTax, IncomeTaxDto } from "../types";
import { userRepository } from "../repositories/userRepository";
import { authenticateAndValidate } from "../middleware/authenticateAndValidate";
import {
  getIncometaxValidator,
  getMyIncometaxValidator,
} from "../validators/incometaxValidator";
import { validatedRoute } from "../middleware/validate";
import {
  getIncomeTaxByStateService,
  getIncomeTaxByUserService,
  getIncomeTaxService,
} from "../services/incometaxService";

const incomeTaxRouter = Router();

incomeTaxRouter.get(
  "/:state",
  validatedRoute(getIncometaxValidator, async (req, res) => {
    let taxes: { married: IncomeTaxDto[]; single: IncomeTaxDto[] };
    if (!req.validated.query.salary) {
      taxes = await getIncomeTaxService(req.validated.params.state);
    } else {
      taxes = await getIncomeTaxByStateService(
        req.validated.params.state,
        req.validated.query.salary,
      );
    }

    res.json(taxes);
  }),
);

incomeTaxRouter.get(
  "/",
  authenticateAndValidate(getMyIncometaxValidator, async (req, res) => {
    const taxes = await getIncomeTaxByUserService(
      req.user.userid,
      req.validated.query.state,
    );

    res.json(taxes);
  }),
);

//TODO: Add params and results that correspond to city IDs and name/states
export default incomeTaxRouter;
