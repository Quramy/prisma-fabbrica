import { defineUserFactory, definePostFactory } from "./__generated__/fabbrica.mod";

const UserFactory = defineUserFactory({
  defaultData: {},
});

const PostFactory = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});

const prisma = jestPrisma.client;

describe("factories", () => {
  describe("UserFactory", () => {
    it("creates records without input parameters", async () => {
      await UserFactory.create();
      await UserFactory.create();
      await expect(prisma.user.count()).resolves.toBe(2);
    });

    it("creates record with input parameters", async () => {
      await UserFactory.create({ id: "user001", name: "Quramy" });
      const user = await prisma.user.findUnique({ where: { id: "user001" } });
      expect(user).toEqual({ id: "user001", name: "Quramy" });
    });
  });

  describe("PostFactory", () => {
    it("creates required association", async () => {
      await PostFactory.create();
      const created = await prisma.post.findFirst({ include: { author: true } });
      expect(created?.id).not.toBeFalsy();
      expect(created?.author.id).not.toBeFalsy();
    });
  });

  describe("PostFactory", () => {
    it("creates record with association", async () => {
      const user = await UserFactory.createForConnect({ name: "quramy" });
      await PostFactory.create({ author: { connect: user } });
      await PostFactory.create({ author: { connect: user } });
      await PostFactory.create({ author: { connect: user } });
      const userWithPosts = await prisma.user.findFirst({ where: { name: "quramy" }, include: { posts: true } });
      expect(userWithPosts?.posts.length).toBe(3);
    });
  });
});
