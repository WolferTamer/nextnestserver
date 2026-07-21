import { ConflictError, NotFoundError, ValidationError } from "../errors";
import { userRepository } from "../repositories/userRepository";
import { AuthDto, UserDto } from "../types";
import { Err, ErrTypes, isErr } from "../utils/errorGuards";
import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import bcrypt from "bcrypt";
import { AuthUser } from "../types/auth";
import signAccessToken from "../utils/signAccessToken";

export const getUserService = async (id: number): Promise<UserDto> => {
  //Compare requested id and id from token
  //Fetch user from SQL
  //If mismatch return 403
  //If match return 200 with account information excluding password

  const findResult = await userRepository.findById(id);
  if (!findResult) {
    throw new NotFoundError("User");
  } else if (isErr(findResult)) {
    throw new ValidationError(findResult.error);
  }
  const dto: UserDto = findResult;
  return dto;
};

export const getManyUserService = async (name?: string): Promise<UserDto[]> => {
  let findResult: UserDto[] | Err;
  if (name) {
    findResult = await userRepository.findByName(name);
  } else {
    findResult = await userRepository.getAll();
  }

  if (isErr(findResult)) {
    throw new NotFoundError();
  }

  return findResult;
};

export const postUserService = async (
  user: userCreateInput,
): Promise<AuthDto> => {
  const hashed = await bcrypt.hash(user.password, 10);
  user.password = hashed;
  const newUser = await userRepository.create(user);

  if (isErr(newUser)) {
    if (newUser.type == ErrTypes.UNIQUEVIOLATION) {
      throw new ConflictError();
    } else {
      throw new ValidationError("Unable to create new user.");
    }
  }
  const token = signAccessToken(newUser.userid, newUser.role);
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
