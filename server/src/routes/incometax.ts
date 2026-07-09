import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { incomeTaxRepository } from "../repositories/incometaxRepository";
import { isErr } from "../utils/errorGuards";
import { IncomeTax } from "../types";
import { userRepository } from "../repositories/userRepository";

//TODO: Add params and results that correspond to city IDs and name/states
export const get = {
  route: "/api/incometax",
  execute: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token!, process.env.SECRETKEY!, async (err, user) => {
      let taxes: IncomeTax[] = [];
      if (err) {
        if (req.query.id) {
        } else if (req.query.state && req.query.salary) {
          let taxlist = await incomeTaxRepository.findByStateLt(
            req.query.state as string,
            Number(req.query.salary),
          );
          if (isErr(taxlist)) {
            res.status(404).json({ error: "unable to find info" });
            return;
          }
          if (taxlist.length > 0) {
            let married = taxlist[0];
            let single = taxlist[0];
            for (let obj of taxlist) {
              if (obj.married && (obj.bracket || 0) > (married.bracket || 0)) {
                married = obj;
              } else if (
                !obj.married &&
                (obj.bracket || 0) > (single.bracket || 0)
              ) {
                single = obj;
              }
            }
            taxes = [single, married];
          }
        } else {
          const t = await incomeTaxRepository.getAll();
          if (isErr(t)) {
            res.status(404).json({ error: "unable to find info" });
            return;
          }
          taxes = t;
        }

        if (taxes.length < 1) {
          res.status(404).json({
            error: "No city of that name or id found.",
          });
          return;
        }
      } else {
        if (!user || typeof user === "string") {
          res.status(403).json({
            error: "NO user object found",
          });
          return;
        }
        let userid = user.userId;
        let userObj = await userRepository.findById(userid);
        if (isErr(userObj) || !userObj) {
          res.status(403).json({
            error: "NO user object found",
          });
          return;
        }
        if (req.query.state) {
          let taxlist = await incomeTaxRepository.findByStateLt(
            req.query.state as string,
            userObj.salary!,
          );
          taxes = [];
          if (!isErr(taxlist) && taxlist.length > 0) {
            let married = taxlist[0];
            let single = taxlist[0];
            for (let obj of taxlist) {
              if (obj.married && obj.bracket! > married.bracket!) {
                married = obj;
              } else if (!obj.married && obj.bracket! > single.bracket!) {
                single = obj;
              }
            }
            taxes = [single, married];
          }
        }
      }

      res.json({ incometaxes: taxes });
    });
  },
};
