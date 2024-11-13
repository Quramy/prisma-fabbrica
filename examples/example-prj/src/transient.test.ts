import { defineUserFactory, defineLoginLogFactory } from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

const LoginLogFactory = defineLoginLogFactory();

const UserFactory = defineUserFactory.withTransientFields({
  loginCount: 0,
  emailDomain: "example.com",
})({
  defaultData: ({ emailDomain }) => {
    return {
      email: `test@${emailDomain}`,
    };
  },
  onAfterCreate: async (user, { loginCount }) => {
    await LoginLogFactory.createList(loginCount, { userId: user.id });
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

    test("default data with transient filed", async () => {
      const user = await UserFactory.create({ emailDomain: "example.test" });

      expect(user.email).toBe("test@example.test");
    });
  });
});
