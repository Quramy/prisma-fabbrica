import type { JestPrisma } from "@quramy/jest-prisma-core";
import type { prisma } from "../src/client";

declare global {
  var jestPrisma: JestPrisma<typeof prisma>;
}
