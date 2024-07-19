import { defineUserFactory } from "../../fixtures/simple-model/__generated__/fabbrica";

describe("traits", () => {
  test("override default data", async () => {
    const UserFactory = defineUserFactory({
      defaultData: {
        name: "default",
      },
      traits: {
        a: {
          data: {
            name: "trait a",
          },
        },
        b: {
          data: {
            name: "trait b",
          },
        },
      },
    });

    await expect(UserFactory.build()).resolves.toMatchObject({ name: "default" });
    await expect(UserFactory.use("a").build()).resolves.toMatchObject({ name: "trait a" });
    await expect(UserFactory.use("b").build()).resolves.toMatchObject({ name: "trait b" });
    await expect(UserFactory.use("a", "b").build()).resolves.toMatchObject({ name: "trait b" });
    await expect(UserFactory.use("b", "a").build()).resolves.toMatchObject({ name: "trait a" });
  });

  test("use transient fields from trait", async () => {
    const UserFactory = defineUserFactory.withTransientFields({
      hoge: 0,
    })({
      defaultData: {
        name: "default",
      },
      traits: {
        myTrait: {
          data: ({ hoge }) => ({ name: `user${hoge}` }),
        },
      },
    });

    await expect(UserFactory.use("myTrait").build({ hoge: 1 })).resolves.toMatchObject({ name: "user1" });
  });
});
