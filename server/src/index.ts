import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
const app = express();
import fs from "fs";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
import initialize from "./initializers";
import jwt from "jsonwebtoken";
import userRouter from "./routes/user";
import { errorHandler } from "./middleware/errorHandler";

if (process.argv.length > 2) {
  initialize(process.argv);
}

//Requires CORS headers to run on localhost with react app
app.use(cors());
app.use(express.json());

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRETKEY!, (err, user) => {
    if (err) return res.sendStatus(403);
    //req.user = user;
    next();
  });
};

//Reads every file inside /routes and uses them to initialize endpoints
app.use("/api/user", userRouter);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server Wow!" });
});

app.use(errorHandler);

//Start accepting HTTP requests
app.listen(PORT, "::", () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
