import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { AuthDto, LoginDto } from "../types";
import { userRepository } from "../repositories/userRepository";
import { isErr } from "../utils/errorGuards";
import bcrypt from "bcrypt";

export const getAuthService = async (authToken: string): Promise<string> => {
  return new Promise<string>((res) => {
    jwt.verify(authToken, process.env.SECRETKEY!, (err, user) => {
      if (err) {
        throw new UnauthorizedError();
      }
      res(authToken);
    });
  });
};

export const postAuthService = async (creds: LoginDto): Promise<AuthDto> => {
  let userObject = await userRepository.findByEmailIncludePassword(creds.email);
  if (isErr(userObject) || !userObject) {
    throw new UnauthorizedError();
  }
  let hashed = userObject.password;
  return new Promise<AuthDto>((res) => {
    bcrypt.compare(creds.password, hashed, (err, data) => {
      if (err || !data) {
        throw new UnauthorizedError();
      }

      const token = jwt.sign(
        { userId: userObject.userid },
        process.env.SECRETKEY!,
      );
      res({
        auth: token,
        user: {
          userid: userObject.userid,
          username: userObject.username,
        },
      });
    });
  });
};
