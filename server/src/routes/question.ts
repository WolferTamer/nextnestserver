import questions from "../questions.json";
import { sequelize } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
const usermodel = sequelize.models.user;

//PARAMS: name (optional string), weather (optional number using bit info)
//RESULTS: All cities that contain the name string and match weather preferences
export const get = {
  route: "/api/question",
  execute: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).json({
        error: "No Authorization header",
      });
      return;
    }
    jwt.verify(token, process.env.SECRETKEY!, (err, user) => {
      if (err) return res.sendStatus(403);
      //req.user = user;

      res.status(200).json({
        questions: questions,
      });
    });
  },
};
