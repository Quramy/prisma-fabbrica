import { defineUserFactory } from "./__generated__/fabbrica";

describe("Generated functions", () => {
  describe("read transientFields from defaultData", () => {
    const UserFactory = defineUserFactory.withTransientFields({
      loginCount: 0,
    })({
      defaultData: ({ loginCount }) => ({
        name: `user_${loginCount}`,
      }),
    });

    test("no input data", async () => {
      expect(UserFactory.build()).resolves.toMatchObject({ name: "user_0" });
    });

    test("with transient field", async () => {
      expect(UserFactory.build({ loginCount: 100 })).resolves.toMatchObject({ name: "user_100" });
    });

    test("with explicit input data", async () => {
      expect(UserFactory.build({ name: "Bob" })).resolves.toMatchObject({ name: "Bob" });
    });

    test("with both fields", async () => {
      expect(UserFactory.build({ loginCount: 100, name: "Bob" })).resolves.toMatchObject({ name: "Bob" });
    });
  });
});
