import { initialize } from "../../initialize";

beforeAll(() => {
  if (typeof jestPrisma === "object") {
    initialize({
      client: () => jestPrisma.client,
    });
  }
});

declare var jestPrisma: any;
