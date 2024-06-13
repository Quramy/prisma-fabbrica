import { defineUserFactory, defineLoginLogFactory } from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

const LoginLogFactory = defineLoginLogFactory();

const UserFactory = defineUserFactory.withTransientFields({
  loginCount: 0,
})({
  onAfterCreate: async (user, { loginCount }) => {
    await LoginLogFactory.createList([...new Array(loginCount).keys()].map(() => ({ userId: user.id })));
  },
});

describe("factories", () => {
  describe("UserFactory", () => {
    test("callback with transient filed", async () => {
      await UserFactory.create({ id: "user01", loginCount: 3 });

      await expect(
        prisma.loginLog.count({
          where: {
            userId: "user01",
          },
        }),
      ).resolves.toBe(3);
    });
  });
});
