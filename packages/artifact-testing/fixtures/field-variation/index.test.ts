import { defineUserFactory, resetSequence } from "./__generated__/fabbrica";

describe("Generated functions", () => {
  beforeEach(() => {
    resetSequence();
  });

  describe("#build argument patterns", () => {
    const factory = defineUserFactory();
    test("no args", async () => {
      await expect(factory.build()).resolves.toBeTruthy();
    });
  });

  describe("defautl data", () => {
    test("default data reflects to build result", async () => {
      const factory = defineUserFactory({
        defaultData: {
          status: "Accepted",
        },
      });

      await expect(factory.build()).resolves.toMatchObject({ status: "Accepted" });
    });

    test("init with sequence", async () => {
      const factory = defineUserFactory({
        defaultData: ({ seq }) => ({
          id: `model_${seq}`,
        }),
      });

      await expect(factory.build()).resolves.toMatchObject({ id: "model_0" });
    });

    test("override defalut data with build argument", async () => {
      const factory = defineUserFactory({
        defaultData: ({ seq }) => ({
          id: `model_${seq}`,
        }),
      });

      await expect(factory.build({ id: "override_id" })).resolves.toMatchObject({ id: "override_id" });
    });
  });
});
