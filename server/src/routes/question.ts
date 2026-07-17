import questions from "../../questions.json";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const questionRouter = Router();

questionRouter.get(
  "/",
  requireAuth(async (req, res) => {
    res.status(200).json({
      questions: questions,
    });
  }),
);

//PARAMS: name (optional string), weather (optional number using bit info)
//RESULTS: All cities that contain the name string and match weather preferences

export default questionRouter;
