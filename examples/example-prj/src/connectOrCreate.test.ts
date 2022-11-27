import { defineUserFactory, definePostFactory } from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

const UserFactory = defineUserFactory();

const PostFactory = definePostFactory({
  defaultData: async () => ({
    author: {
      connectOrCreate: {
        where: {
          id: "user001",
        },
        create: await UserFactory.buildCreateInput({
          id: "user001",
        }),
      },
    },
  }),
});

describe("factories", () => {
  describe("PostFactory", () => {
    it("creates post record", async () => {
      await PostFactory.create();
      await expect(prisma.user.count()).resolves.toBe(1);
    });

    it("creates related user at most one", async () => {
      await PostFactory.create();
      await PostFactory.create();
      await PostFactory.create();
      await expect(prisma.user.count()).resolves.toBe(1);
    });
  });
});
