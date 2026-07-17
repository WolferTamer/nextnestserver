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
import { AuthUser } from "../types/auth";

export const getUserService = async (
  id: number,
  user: AuthUser,
): Promise<UserDto> => {
  return new Promise<UserDto>(async (res) => {
    //Compare requested id and id from token
    //Fetch user from SQL
    //If mismatch return 403
    //If match return 200 with account information excluding password

    let tokenid = user.userid;
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
  user: AuthUser,
  newUser: userUpdateInput,
): Promise<UserDto> => {
  const updatedUser = await userRepository.editById(user.userid, newUser);
  if (isErr(updatedUser)) {
    throw new ValidationError("Unable to edit user");
  }
  const filteredObj: UserDto = updatedUser;
  return filteredObj;
};
