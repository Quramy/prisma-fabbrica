import { defineUserFactory, type UserFactoryInterface } from "./__generated__/fabbrica";
import { defineLoginLogFactory, type LoginLogFactoryInterface } from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

type LoginLogFactory = LoginLogFactoryInterface;

function getLoginLogFactory(): LoginLogFactory {
  return defineLoginLogFactory();
}

type UserTransientFields = {
  loginCount: number;
};

type UserTraits = "withLoginRecords";

type UserFactory = UserFactoryInterface<UserTransientFields, UserTraits>;

function getUserFactory(): UserFactory {
  return defineUserFactory.withTransientFields({
    loginCount: 0,
  } satisfies UserTransientFields)({
    traits: {
      withLoginRecords: {
        onAfterCreate: async (user, { loginCount }) => {
          await getLoginLogFactory().createList(loginCount, { userId: user.id });
        },
      },
    },
  });
}

describe("factory defined with interface", () => {
  test("works correctly", async () => {
    await getUserFactory().use("withLoginRecords").create({ id: "user01", loginCount: 3 });

    await expect(
      prisma.loginLog.count({
        where: {
          userId: "user01",
        },
      }),
    ).resolves.toBe(3);
  });
});
