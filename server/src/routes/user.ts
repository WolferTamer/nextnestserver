import { Router } from "express";
import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import {
  getUserService,
  postUserService,
  putUserService,
} from "../services/userService";
import { validatedRoute } from "../middleware/validate";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../validators/userValidors";
import { authenticateAndValidate } from "../middleware/authenticateAndValidate";

const userRouter = Router();

userRouter.get(
  "/",
  ...authenticateAndValidate(getUserSchema, async (req, res) => {
    let { id } = req.validated.query;
    const user = await getUserService(id, req.user);
    res.json({
      user: user,
    });
  }),
);

userRouter.post(
  "/",
  ...validatedRoute(createUserSchema, async (req, res) => {
    let user: userCreateInput = req.validated.body;
    let newUser = await postUserService(user);
    res.status(201).json(newUser);
  }),
);

userRouter.put(
  "/",
  ...authenticateAndValidate(updateUserSchema, async (req, res) => {
    let body: userUpdateInput = req.validated.body;
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
