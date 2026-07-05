import { sequelize } from "../db";
import Sequelize, { Model } from "sequelize";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

//TODO: Add params and results that correspond to city IDs and name/states
export const get = {
  route: "/api/incometax",
  execute: async (req: Request, res: Response) => {
    let incometax = sequelize.models.incometax;
    let usermodel = sequelize.models.user;
    let taxes: Model<any, any>[] | undefined;
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.SECRETKEY, async (err, user) => {
      if (err) {
        if (req.query.id) {
          taxes = await incometax.findAll({
            where: {
              id: req.query.id,
            },
          });
        } else if (req.query.state && req.query.salary) {
          let taxlist = await incometax.findAll({
            where: {
              state: req.query.state,
              bracket: {
                [Sequelize.Op.lte]: req.query.salary,
              },
            },
          });
          taxes = [];
          if (taxlist.length > 0) {
            let married = taxlist[0];
            let single = taxlist[0];
            for (let obj of taxlist) {
              if (obj.married && obj.bracket > married.bracket) {
                married = obj;
              } else if (!obj.married && obj.bracket > single.bracket) {
                single = obj;
              }
            }
            taxes = [single, married];
          }
        } else {
          taxes = await incometax.findAll();
        }

        if (taxes.length < 1) {
          res.status(404).json({
            error: "No city of that name or id found.",
          });
          return;
        }
      } else {
        let userid = user.userId;
        let userObj = (
          await usermodel.findAll({
            where: {
              userid: userid,
            },
          })
        )[0];
        if (req.query.state) {
          let taxlist = await incometax.findAll({
            where: {
              state: req.query.state,
              bracket: {
                [Sequelize.Op.lte]: userObj.salary,
              },
            },
          });
          taxes = [];
          if (taxlist.length > 0) {
            let married = taxlist[0];
            let single = taxlist[0];
            for (let obj of taxlist) {
              if (obj.married && obj.bracket > married.bracket) {
                married = obj;
              } else if (!obj.married && obj.bracket > single.bracket) {
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
