import { prisma } from "../lib/prisma";
import { parsePrismaError } from "../utils/errorGuards";
import { SessionRepository } from "./repoTypes";

export const sessionRepository: SessionRepository = {
  async findById(id) {
    try {
      const session = await prisma.session.findUnique({
        where: { id: id },
      });
      return session;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByUserId(id) {
    try {
      const sessions = await prisma.session.findMany({
        where: { userid: id },
      });
      return sessions;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async create(data) {
    try {
      const sessions = await prisma.session.create({ data: data });
      return sessions;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async revokeFamily(session) {
    try {
      const res = await prisma.session.updateMany({
        where: { userid: session.userid },
        data: {
          revokedAt: new Date(),
        },
      });
      return res.count;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async replace(oldSession, newSession) {
    try {
      const sessions = await prisma.session.create({ data: newSession });
      await prisma.session.update({
        where: { id: oldSession },
        data: { revokedAt: new Date(), replacedBy: sessions.id },
      });
      return sessions;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async revoke(session) {
    try {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          revokedAt: new Date(),
        },
      });
    } catch (e) {
      return parsePrismaError(e);
    }
  },
};
