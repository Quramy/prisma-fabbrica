import { defineUserFactory, resetSequence } from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

const UserFactory = defineUserFactory({
  defaultData: async ({ seq }) => ({
    id: `user${seq.toString().padStart(3, "0")}`,
  }),
});

describe("factories", () => {
  describe("UserFactory", () => {
    beforeEach(async () => {
      resetSequence();
      await UserFactory.create();
    });

    it("creates record with sequential id", async () => {
      await expect(prisma.user.findUnique({ where: { id: "user000" } })).resolves.not.toBeNull();
    });

    it("expected that the sequential id is restarted", async () => {
      await UserFactory.create();
      await expect(prisma.user.findUnique({ where: { id: "user000" } })).resolves.not.toBeNull();
      await expect(prisma.user.findUnique({ where: { id: "user001" } })).resolves.not.toBeNull();
    });
  });
});
