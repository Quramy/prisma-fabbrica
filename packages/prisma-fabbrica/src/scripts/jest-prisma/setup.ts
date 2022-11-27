import { initialize } from "../../initialize";
import { resetSequence } from "../../helpers";

beforeAll(() => {
  if (typeof jestPrisma === "object") {
    initialize({
      prisma: () => jestPrisma.client,
    });
  }
});

beforeEach(() => resetSequence());

declare var jestPrisma: any;
