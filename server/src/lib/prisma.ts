import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const pool = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  connectionLimit: 5,
  database: "nextnestdev",
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  logger: {
    error: (err) => console.error("adapter error:", err),
    warning: (info) => console.warn("warning:", info),
  },
});

const omitConfig = { user: { password: true } } as const;

export const prisma = new PrismaClient({
  adapter: pool,
  omit: omitConfig,
});
