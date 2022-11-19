import { setup } from "../../setup";

beforeAll(() => {
  if (typeof jestPrisma === "object") {
    setup({
      client: () => jestPrisma.client,
    });
  }
});

declare var jestPrisma: any;
