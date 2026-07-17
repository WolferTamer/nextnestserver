import { Request, Response, Router } from "express";
import { getAuthService, postAuthService } from "../services/authService";
import { requireAuth } from "../middleware/requireAuth";
import { AuthenticatedRequest } from "../types/auth";
import { validatedRoute } from "../middleware/validate";
import { postAuthValidator } from "../validators/authValidator";

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
    const auth = await postAuthService(req.validated.body.user);
    res.json(auth);
  }),
);

export default authRouter;
