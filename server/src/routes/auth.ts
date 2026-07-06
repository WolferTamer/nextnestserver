import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { isErr } from "../utils/errorGuards";

export const get = {
  route: "/api/auth",
  execute: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({
        error: "No body or authorization header",
      });
      return;
    }
    jwt.verify(token, process.env.SECRETKEY!, (err, user) => {
      if (err) return res.sendStatus(403);
      res.status(200).json({
        auth: token,
      });
    });
  },
};
export const post = {
  route: "/api/auth",
  execute: async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({
        error: "No body",
      });
      return;
    }
    let user = req.body.user;
    if (!user) {
      res.status(400).json({
        error: "No user object in body",
      });
      return;
    }
    let email = user.email;
    let password = user.password;
    if (!email || !password) {
      res.status(400).json({
        error: "User object missing email or password",
      });
      return;
    }
    let userObject = await userRepository.findByIdIncludePassword(user.id);
    if (isErr(userObject)) {
      res.status(403).json({
        error: "Invalid credentials",
      });
      return;
    } else if (!userObject) {
      res.status(404).json({
        error: "No user by that ID",
      });
      return;
    }
    let hashed = userObject.password;
    bcrypt.compare(password, hashed, (err, data) => {
      if (err) {
        res.status(500).json({
          error: "Internal error",
        });
        return;
      }
      if (data) {
        const token = jwt.sign(
          { userId: userObject.userid },
          process.env.SECRETKEY!,
        );
        res.status(200).json({
          auth: token,
          user: {
            userid: userObject.userid,
            username: userObject.username,
          },
        });
        return;
      } else {
        res.status(403).json({
          error: "Invalid credentials",
        });
        return;
      }
    });
  },
};
