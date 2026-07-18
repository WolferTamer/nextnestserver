import jwt from "jsonwebtoken";
import { UnauthorizedError, ValidationError } from "../errors";
import { AuthDto, LoginDto } from "../types";
import { userRepository } from "../repositories/userRepository";
import { isErr } from "../utils/errorGuards";
import bcrypt from "bcrypt";
import signAccessToken from "../utils/signAccessToken";
import crypto from "crypto";
import sha256 from "../utils/sha256";
import { sessionRepository } from "../repositories/sessionRepository";
import { CookieOptions } from "express";

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

export const loginService = async (
  creds: LoginDto,
): Promise<{
  auth: AuthDto;
  refresh: {
    value: string;
    options: CookieOptions;
  };
}> => {
  let userObject = await userRepository.findByEmailIncludePassword(creds.email);
  if (
    isErr(userObject) ||
    !userObject ||
    !(await bcrypt.compare(creds.password, userObject.password))
  ) {
    throw new UnauthorizedError();
  }
  const accessToken = signAccessToken(userObject.userid, userObject.role);
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const refreshHash = sha256(refreshToken);
  const today = new Date();
  const session = await sessionRepository.create({
    user: { connect: { userid: userObject.userid } },
    refreshHash,
    expiresAt: new Date(today.setDate(today.getDate() + 30)),
  });
  if (isErr(session)) {
    throw ValidationError;
  }
  return {
    auth: {
      auth: accessToken,
      user: { userid: userObject.userid, username: userObject.username },
    },
    refresh: {
      value: `${session.id}.${refreshToken}`,
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    },
  };
};

export const refreshService = async (
  refreshToken: string,
  sessionId: number,
): Promise<{
  auth: AuthDto;
  refresh: {
    value: string;
    options: CookieOptions;
  };
}> => {
  const session = await sessionRepository.findById(Number(sessionId));
  if (
    !session ||
    isErr(session) ||
    session.revokedAt ||
    session.expiresAt < new Date()
  ) {
    throw UnauthorizedError;
  }

  if (session.refreshHash !== sha256(refreshToken)) {
    // token reuse / mismatch -> possible theft, kill the whole chain
    await sessionRepository.revokeFamily(session);
    throw UnauthorizedError;
  }

  const user = await userRepository.findById(session.userid);
  if (isErr(user) || !user) {
    throw UnauthorizedError;
  }

  const newToken = crypto.randomBytes(64).toString("hex");
  const today = new Date();
  const newsession = await sessionRepository.replace(session.id, {
    user: { connect: { userid: session.userid } },
    refreshHash: sha256(newToken),
    expiresAt: new Date(today.setDate(today.getDate() + 30)),
  });
  if (isErr(newsession)) {
    throw UnauthorizedError;
  }
  return {
    auth: {
      user: { userid: user.userid, username: user.username },
      auth: signAccessToken(session.userid, user.role),
    },
    refresh: {
      value: `${newsession.id}.${newToken}`,
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    },
  };
};

export const logoutService = async (
  refreshToken: string,
  sessionId: number,
): Promise<void> => {
  const session = await sessionRepository.findById(Number(sessionId));
  if (
    !session ||
    isErr(session) ||
    session.revokedAt ||
    session.expiresAt < new Date()
  ) {
    throw UnauthorizedError;
  }

  if (session.refreshHash !== sha256(refreshToken)) {
    // token reuse / mismatch -> possible theft, kill the whole chain
    await sessionRepository.revokeFamily(session);
    throw UnauthorizedError;
  }

  const revoked = await sessionRepository.revoke(session);
  if (isErr(revoked)) {
    throw UnauthorizedError;
  }
};

export const logoutAllService = async (
  refreshToken: string,
  sessionId: number,
): Promise<number> => {
  const session = await sessionRepository.findById(Number(sessionId));
  if (
    !session ||
    isErr(session) ||
    session.revokedAt ||
    session.expiresAt < new Date()
  ) {
    throw UnauthorizedError;
  }

  if (session.refreshHash !== sha256(refreshToken)) {
    // token reuse / mismatch -> possible theft, kill the whole chain
    await sessionRepository.revokeFamily(session);
    throw UnauthorizedError;
  }

  const revoked = await sessionRepository.revokeFamily(session);
  if (isErr(revoked)) {
    throw UnauthorizedError;
  }

  return revoked;
};
