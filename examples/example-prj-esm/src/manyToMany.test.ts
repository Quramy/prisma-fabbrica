import {
  defineCategoryFactory,
  definePostFactory,
  defineUserFactory,
  defineCommentFactory,
} from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

const UserFactory = defineUserFactory();

const PostFactory = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});

const CategoryFactory = defineCategoryFactory();

const CommentFactory = defineCommentFactory({
  defaultData: {
    post: PostFactory,
    author: UserFactory,
  },
});

describe("factories", () => {
  describe("PostFactory", () => {
    test("Implicit many-to-many pattern", async () => {
      await PostFactory.create({
        title: "TypeScript compiler",
        categories: {
          create: await CategoryFactory.buildList([{ name: "Node.js" }, { name: "TypeScript" }]),
        },
      });
      const category = await prisma.category.findUnique({ where: { name: "Node.js" }, include: { posts: true } });
      expect(category?.posts[0]?.title).toBe("TypeScript compiler");
    });
  });

  describe("UserFactory", () => {
    test("deep nested creation", async () => {
      await UserFactory.create({
        posts: {
          create: await PostFactory.buildList([
            {
              comments: { create: await CommentFactory.buildList(2) },
            },
          ]),
        },
      });
      await expect(prisma.user.count()).resolves.toBe(3);
    });
  });
});
