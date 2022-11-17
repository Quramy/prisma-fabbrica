import { defineFactory } from "./__generated__/factories";

const UserFactory = defineFactory("User", {
  defaultAttrs: {},
});

const PostFactory = defineFactory("Post", {
  defaultAttrs: async () => ({
    author: {
      connect: {
        id: (await UserFactory.create()).id,
      },
    },
  }),
});

const prisma = jestPrisma.client;

describe("factories", () => {
  describe("user", () => {
    beforeEach(async () => {
      await UserFactory.create({ name: "quramy" });
      await UserFactory.create({ name: "kurami" });
    });
    test("created", async () => {
      prisma.user.create({
        data: {
          id: "",
          name: "",
          posts: {
            create: [],
          },
        },
      });
      await expect(prisma.user.count()).resolves.toBe(2);
    });
  });

  describe("post", () => {
    beforeEach(async () => {
      await PostFactory.create();
    });

    test("post", async () => {
      const created = await prisma.post.findFirst({ include: { author: true } });
      expect(created?.id).not.toBeFalsy();
      expect(created?.author.id).not.toBeFalsy();
    });
  });
});
