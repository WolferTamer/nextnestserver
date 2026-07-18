import { Router } from "express";
import {
  getAuthService,
  loginService,
  logoutAllService,
  logoutService,
  refreshService,
} from "../services/authService";
import { requireAuth } from "../middleware/requireAuth";
import { AuthenticatedRequest } from "../types/auth";
import { validatedRoute } from "../middleware/validate";
import { postAuthValidator } from "../validators/authValidator";
import { UnauthorizedError } from "../errors";

const authRouter = Router();

authRouter.get(
  "/",
  ...requireAuth(async (req, res) => {
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
  }),
);

authRouter.post(
  "/",
  ...validatedRoute(postAuthValidator, async (req, res) => {
    const { auth, refresh } = await loginService(req.validated.body.user);
    res.cookie("refreshToken", refresh.value, refresh.options);
    res.json(auth);
  }),
);

authRouter.post("/refresh", async (req, res) => {
  if (!req.cookies) {
    throw new UnauthorizedError();
  }
  const raw = req.cookies.refreshToken;
  if (!raw) throw new UnauthorizedError();
  const [sessionId, token] = (raw as string).split(".");
  const { auth, refresh } = await refreshService(token, Number(sessionId));
  res.cookie("refreshToken", refresh.value, refresh.options);
  res.json(auth);
});

authRouter.get("/logout", async (req, res) => {
  const raw = req.cookies.refreshToken;
  if (!raw) throw UnauthorizedError;
  const [sessionId, token] = (raw as string).split(".");
  await logoutService(token, Number(sessionId));
  res.sendStatus(200);
});

authRouter.get("/logout-all", async (req, res) => {
  const raw = req.cookies.refreshToken;
  if (!raw) throw UnauthorizedError;
  const [sessionId, token] = (raw as string).split(".");
  const num = await logoutAllService(token, Number(sessionId));
  res.json({
    count: num,
  });
});

export default authRouter;
