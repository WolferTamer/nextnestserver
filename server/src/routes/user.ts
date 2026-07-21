import { Router } from "express";
import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import {
  getManyUserService,
  getUserService,
  postUserService,
  putUserService,
} from "../services/userService";
import { validatedRoute } from "../middleware/validate";
import {
  createUserSchema,
  getManyUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
} from "../validators/userValidors";
import { authenticateAndValidate } from "../middleware/authenticateAndValidate";
import { requireRole } from "../middleware/requireRole";
import { requireAuth } from "../middleware/requireAuth";

const userRouter = Router();

userRouter.get(
  "/:id",
  requireRole("ADMIN"),
  ...validatedRoute(getUserByIdSchema, async (req, res) => {
    const { id } = req.validated.params;
    const user = await getUserService(id);
    res.json({
      user: user,
    });
  }),
);

userRouter.get(
  "/me",
  ...requireAuth(async (req, res) => {
    const user = await getUserService(req.user.userid);
    res.json({
      user: user,
    });
  }),
);

userRouter.get(
  "/",
  requireRole("ADMIN"),
  ...validatedRoute(getManyUsersSchema, async (req, res) => {
    const users = await getManyUserService(req.validated.query.name);
    res.json({ users: users });
  }),
);

userRouter.post(
  "/",
  ...validatedRoute(createUserSchema, async (req, res) => {
    const user: userCreateInput = req.validated.body;
    const newUser = await postUserService(user);
    res.status(201).json(newUser);
  }),
);

userRouter.put(
  "/",
  ...authenticateAndValidate(updateUserSchema, async (req, res) => {
    const body: userUpdateInput = req.validated.body;
    const user = await putUserService(req.user, body);
    res.json({ user: user });
  }),
);

export default userRouter;

//PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
//RESULTS: No params results in a list of all cities.
//         Only name results in a list of cities that contain the given name
//         Id results in the city that has that id
//TODO: Require state along with a city name
