import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { UserDto } from "../types";
import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import { isErr } from "../utils/errorGuards";

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
export const get = {
  route: "/api/user",
  execute: async (req: Request, res: Response) => {
    let id = req.query.id;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).json({
        error: "No Authorization",
      });
      return;
    }
    jwt.verify(token, process.env.SECRETKEY!, async (err, user) => {
      //Compare requested id and id from token
      //Fetch user from SQL
      //If mismatch return 403
      //If match return 200 with account information excluding password
      if (err || !user) {
        res.status(403).json({
          error: "Not Authorized",
        });
        return;
      }

      if (typeof user === "string" || !user.userId) {
        res.status(403).json({
          error: "Not Authorized",
        });
        return;
      }

      let tokenid = user.userId;
      if (id == tokenid) {
        let findResult = await userRepository.findById(tokenid);
        if (!findResult) {
          res.status(400).json({
            error: "No User with that ID",
          });
          return;
        } else if (isErr(findResult)) {
          res.status(400).json({
            error: findResult.error,
          });
          return;
        }
        const dto: UserDto = findResult;
        res.status(200).json({
          user: dto,
        });
        return;
      } else {
        res.status(403).json({
          error: "Not Authorized",
        });
        return;
      }
    });
  },
};
export const post = {
  route: "/api/user",
  execute: async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({
        error: "No body attached.",
      });
      return;
    }
    let user: userCreateInput = req.body.user;
    if (user) {
      let hashed = await bcrypt.hash(user.password, 10);
      user.password = hashed;
      const newUser = await userRepository.create(user);

      if (isErr(newUser)) {
        res.status(400).json({ error: newUser.error });
        return;
      }
      const token = jwt.sign(
        { userId: newUser.userid },
        process.env.SECRETKEY!,
      );
      res.status(203).json({
        message: `User with email ${user.email} created`,
        auth: token,
        user: newUser.userid,
      });
    }
  },
};
export const put = {
  route: "/api/user",
  execute: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).json({
        error: "No Authorization",
      });
      return;
    }
    jwt.verify(token, process.env.SECRETKEY!, async (err, u) => {
      let id = req.query.id;
      if (!id) {
        res.status(400).json({
          error: "No ID.",
        });
        return;
      }
      if (!req.body) {
        res.status(400).json({
          error: "No body attached.",
        });
        return;
      }

      let body = req.body;
      let updateBody: userUpdateInput = {};
      if (
        body.salary &&
        (typeof body.salary !== "number" ||
          body.salary % 1 != 0 ||
          body.salary < 0)
      ) {
        res.status(400).json({
          error: "Salary must be an integer greater than or equal to 0.",
        });
        return;
      } else {
        updateBody.salary = body.salary;
      }
      if (!body.salary) {
        res.status(400).json({
          error:
            "You must include at least one updatable option such as salary.",
        });
        return;
      }
      const updatedUser = await userRepository.editById(Number(id), updateBody);
      if (isErr(updatedUser)) {
        res.status(400).json({
          error: updatedUser.error,
        });
        return;
      }
      const filteredObj: UserDto = updatedUser;
      res.status(200).json({
        user: filteredObj,
      });
      return;
    });
  },
};
