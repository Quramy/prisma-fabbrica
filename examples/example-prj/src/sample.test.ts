import { v4 as uuid } from "uuid";
import { defineFactory } from "./__generated__/factories";

const UserFactory = defineFactory("User", {
  defaultAttrs: () => ({
    id: uuid(),
    name: "",
  }),
});

const prisma = jestPrisma.client;

describe("factories", () => {
  beforeEach(async () => {
    await UserFactory.create({ name: "quramy" });
    await UserFactory.create({ name: "kurami" });
  });
  test("created", async () => {
    await expect(prisma.user.count()).resolves.toBe(2);
  });
});
