import {
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

const CommentFactory = defineCommentFactory({
  defaultData: {
    post: PostFactory,
    author: UserFactory,
  },
});


describe("UserStats view", () => {
  test("should get user stats correctly", async () => {
    const users = await UserFactory.createList(2);

    const posts = await PostFactory.createList([
      { author: { connect: { id: users[0].id } }, title: "JavaScript engine" },
      { author: { connect: { id: users[1].id } }, title: "Web Development" },
      { author: { connect: { id: users[1].id } }, title: "Database Systems" },
    ])

    await CommentFactory.createList([
      { post: { connect: { id: posts[0].id } }, author: { connect: { id: users[0].id } } },
      { post: { connect: { id: posts[1].id } }, author: { connect: { id: users[1].id } } },
      { post: { connect: { id: posts[1].id } }, author: { connect: { id: users[1].id } } },
      { post: { connect: { id: posts[1].id } }, author: { connect: { id: users[1].id } } },
      { post: { connect: { id: posts[2].id } }, author: { connect: { id: users[1].id } } },
    ]);

    const user1 = await prisma.user.findUnique({
      where: { id: users[0].id },
      select: { stats: true },
    });

    expect(user1.stats.postCount).toBe(1);
    expect(user1.stats.commentCount).toBe(1);

    const user2 = await prisma.user.findUnique({
      where: { id: users[1].id },
      select: { stats: true },
    });

    expect(user2.stats.postCount).toBe(2);
    expect(user2.stats.commentCount).toBe(4);
  });
});