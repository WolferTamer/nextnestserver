import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const pool = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  connectionLimit: 5,
});

const omitConfig = { user: { password: true } } as const;

export const prisma = new PrismaClient({
  adapter: pool,
  omit: omitConfig,
});
