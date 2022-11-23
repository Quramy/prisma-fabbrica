import { initialize } from "../../initialize";

beforeAll(() => {
  if (typeof jestPrisma === "object") {
    initialize({
      prisma: () => jestPrisma.client,
    });
  }
});

declare var jestPrisma: any;
