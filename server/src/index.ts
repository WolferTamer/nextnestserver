import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
import initialize from "./initializers";
import userRouter from "./routes/user";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import cityRouter from "./routes/city";
import incomeTaxRouter from "./routes/incometax";
import questionRouter from "./routes/question";
import taxRouter from "./routes/tax";
import weatherRouter from "./routes/weather";
import cookieParser from "cookie-parser";
import searchRouter from "./routes/search";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./openapi/generateDocument";

if (process.argv.length > 2) {
  initialize(process.argv);
}

//Requires CORS headers to run on localhost with react app
app.use(cors());
app.use(cookieParser(process.env.SECRETKEY!));
app.use(express.json());

//Reads every file inside /routes and uses them to initialize endpoints
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/city", cityRouter);
app.use("/api/incometax", incomeTaxRouter);
app.use("/api/question", questionRouter);
app.use("/api/tax", taxRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/search", searchRouter);

const openApiDocument = generateOpenApiDocument();

app.get("/api/docs.json", (req, res) => res.json(openApiDocument));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

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
