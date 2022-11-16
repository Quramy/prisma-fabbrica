import { setup } from "@quramy/prisma-fabbrica";

beforeAll(() => {
  setup({
    client: () => jestPrisma.client,
  });
});
