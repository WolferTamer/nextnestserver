import { prisma } from "../lib/prisma";
import { parsePrismaError } from "../utils/errorGuards";
import { IncomeTaxRepository } from "./repoTypes";

export const incomeTaxRepository: IncomeTaxRepository = {
  async getAll() {
    try {
      const taxes = await prisma.incometax.findMany();
      return taxes;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByState(state: string) {
    try {
      const taxes = await prisma.incometax.findMany({
        where: { state: state },
      });
      return taxes;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByLt(income, married = true) {
    try {
      const taxes = await prisma.incometax.findMany({
        where: { bracket: { lte: income }, married },
      });
      return taxes;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async findByStateLt(state: string, income: number, married = true) {
    try {
      const taxes = await prisma.incometax.findMany({
        where: { state: state, bracket: { lte: income }, married: married },
      });
      return taxes;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async replace(state, taxes) {
    try {
      await prisma.incometax.deleteMany({ where: { state: state } });
      const t = await prisma.incometax.createMany({ data: taxes });
      return t.count;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
  async bulkReset(newtaxes) {
    try {
      await prisma.incometax.deleteMany();
      const t = await prisma.incometax.createMany({ data: newtaxes });
      return t.count;
    } catch (e) {
      return parsePrismaError(e);
    }
  },
};
