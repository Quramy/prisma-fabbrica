import {
  defineUserFactory,
  definePostFactory,
  defineCommentFactory,
  CommentFactoryInterface,
} from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

export const UserFactory = defineUserFactory();

export const PostFactory = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
  traits: {
    withComment: {
      data: async () => ({
        comments: {
          create: await getCommentFactory().build(),
        },
      }),
    },
    withTwoComments: {
      data: async () => ({
        comments: {
          create: await getCommentFactory().buildList(2),
        },
      }),
    },
    title: {
      data: {
        title: "TITLE",
      },
    },
  },
});

export const CommentFactory = defineCommentFactory({
  defaultData: {
    author: UserFactory,
    post: PostFactory,
  },
});

function getCommentFactory(): CommentFactoryInterface {
  return CommentFactory;
}

describe("factories", () => {
  describe("PostFactory", () => {
    describe("without traits", () => {
      it("creates records without creating comments", async () => {
        const post = await PostFactory.create();
        await expect(prisma.comment.count({ where: { postId: post.id } })).resolves.toBe(0);
      });
    });

    describe("with trait", () => {
      it("creates records with creating comments", async () => {
        const post = await PostFactory.use("withComment").create();
        await expect(prisma.comment.count({ where: { postId: post.id } })).resolves.toBe(1);
      });
    });

    describe("with multiple traits", () => {
      it("creates records with creating comments", async () => {
        const post = await PostFactory.use("title", "withComment").create();
        expect(post.title).toBe("TITLE");
        await expect(prisma.comment.count({ where: { postId: post.id } })).resolves.toBe(1);
      });

      test("trait order", async () => {
        const post1 = await PostFactory.use("withComment", "withTwoComments").create();
        const post2 = await PostFactory.use("withTwoComments", "withComment").create();
        await expect(prisma.comment.count({ where: { postId: post1.id } })).resolves.toBe(2);
        await expect(prisma.comment.count({ where: { postId: post2.id } })).resolves.toBe(1);
      });
    });
  });
});
