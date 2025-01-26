import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

export let prisma: PrismaClient;

if (process.env.NODE_ENV !== "development") {
  prisma = new PrismaClient();
} else {
  prisma = global.prisma;
}

global.prisma = global.prisma || new PrismaClient();
