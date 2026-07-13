import { Request, Response } from "express";
import { getAuthService, postAuthService } from "../services/authService";

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
    const auth = await getAuthService(token);
    res.json({
      auth: auth,
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
    const auth = await postAuthService({ email: email, password: password });
    res.json(auth);
  },
};
