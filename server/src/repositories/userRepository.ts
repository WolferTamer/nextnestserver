import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma";
import {
  ERR,
  isErrorWithMessage,
  parsePrismaError,
} from "../utils/errorGuards";
import { UserRepository } from "./repoTypes";

export const userRepository: UserRepository = {
  async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          userid: id,
        },
      });
      return user;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByIdIncludePassword(id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          userid: id,
        },
        select: {
          userid: true,
          password: true,
          email: true,
          username: true,
          salary: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (user) {
        return user;
      }

      return null;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async create(data) {
    try {
      const newUser = await prisma.user.create({ data: data });
      return newUser;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async getAll() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async editById(id, data) {
    try {
      const updatedUser = await prisma.user.update({
        where: { userid: id },
        data: data,
      });
      return updatedUser;
    } catch (e) {
      let error = "";
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          error = "That user doesn't exist";
        } else if (e.code === "P2002") {
          error = "That email is already in use";
        } else {
          error = e.message;
        }
      } else if (isErrorWithMessage(e)) {
        error = e.message;
      } else {
        error = "An unknown error occured";
      }
      return {
        [ERR]: true,
        error: error,
      };
    }
  },
  async deleteById(id) {
    try {
      await prisma.user.delete({
        where: { userid: id },
      });
    } catch (e) {
      return parsePrismaError(e);
    }
  },
};
