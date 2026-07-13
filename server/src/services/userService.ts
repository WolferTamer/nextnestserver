import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../errors";
import { userRepository } from "../repositories/userRepository";
import { AuthDto, UserDto } from "../types";
import jwt from "jsonwebtoken";
import { ErrTypes, isErr } from "../utils/errorGuards";
import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import bcrypt from "bcrypt";

export const getUserService = async (
  id: number,
  authToken: string,
): Promise<UserDto> => {
  return new Promise<UserDto>((res) => {
    jwt.verify(authToken, process.env.SECRETKEY!, async (err, user) => {
      //Compare requested id and id from token
      //Fetch user from SQL
      //If mismatch return 403
      //If match return 200 with account information excluding password
      if (err || !user || typeof user === "string" || !user.userId) {
        throw new UnauthorizedError();
      }

      let tokenid = user.userId;
      if (id == tokenid) {
        let findResult = await userRepository.findById(tokenid);
        if (!findResult) {
          throw new NotFoundError("User");
        } else if (isErr(findResult)) {
          throw new ValidationError(findResult.error);
        }
        const dto: UserDto = findResult;
        res(dto);
      } else {
        throw new UnauthorizedError();
      }
    });
  });
};

export const postUserService = async (
  user: userCreateInput,
): Promise<AuthDto> => {
  let hashed = await bcrypt.hash(user.password, 10);
  user.password = hashed;
  const newUser = await userRepository.create(user);

  if (isErr(newUser)) {
    if (newUser.type == ErrTypes.UNIQUEVIOLATION) {
      throw new ConflictError();
    } else {
      throw new ValidationError("Unable to create new user.");
    }
  }
  const token = jwt.sign({ userId: newUser.userid }, process.env.SECRETKEY!);
  return {
    auth: token,
    user: {
      userid: newUser.userid,
      username: newUser.username,
    },
  };
};

export const putUserService = async (
  authToken: string,
  newUser: userUpdateInput,
): Promise<UserDto> => {
  return new Promise<UserDto>((res) => {
    jwt.verify(authToken, process.env.SECRETKEY!, async (err, u) => {
      if (err || !u || typeof u === "string" || !u.userId) {
        throw new UnauthorizedError();
      }

      let id = u.userid;

      const updatedUser = await userRepository.editById(Number(id), newUser);
      if (isErr(updatedUser)) {
        throw new ValidationError("Unable to edit user");
      }
      const filteredObj: UserDto = updatedUser;
      res(filteredObj);
      return;
    });
  });
};
