import { prisma } from "../lib/prisma";
import { parsePrismaError } from "../utils/errorGuards";
import { TaxRepositoty } from "./repoTypes";

export const taxRepository: TaxRepositoty = {
  async findByCityId(cityid) {
    try {
      return await prisma.tax.findUnique({ where: { cityId: cityid } });
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async getAll() {
    try {
      return await prisma.tax.findMany();
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async create(data) {
    try {
      return await prisma.tax.create({ data: data });
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async upsertByCityId(cityid, create, update) {
    try {
      return await prisma.tax.upsert({
        where: { cityId: cityid },
        create: create,
        update: update,
      });
    } catch (e) {
      return parsePrismaError(e);
    }
  },
};
