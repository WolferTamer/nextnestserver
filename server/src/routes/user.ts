import { Request, Response, Router } from "express";
import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import { getUserService, putUserService } from "../services/userService";
import { validatedRoute } from "../middleware/validate";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../validators/userValidors";

const userRouter = Router();

userRouter.get(
  "/",
  ...validatedRoute(getUserSchema, async (req: Request, res: Response) => {
    let id = Number(req.query.id);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).json({
        error: "No Authorization",
      });
      return;
    }
    const user = await getUserService(id, token);
    res.json({
      user: user,
    });
  }),
);

userRouter.post(
  "/",
  ...validatedRoute(createUserSchema, async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({
        error: "No body attached.",
      });
      return;
    }
    let user: userCreateInput = req.body.user;
    if (user) {
      res.status(203).json(user);
    } else {
      res.status(400).json({
        error: "Body does not have the correct parameters",
      });
    }
  }),
);

userRouter.put(
  "/",
  ...validatedRoute(updateUserSchema, async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).json({
        error: "No Authorization",
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
        error: "You must include at least one updatable option such as salary.",
      });
      return;
    }
    const user = await putUserService(token, updateBody);
    res.json({ user: user });
  }),
);

export default userRouter;

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
