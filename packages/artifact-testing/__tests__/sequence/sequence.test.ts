import { defineUserFactory, resetSequence } from "../../fixtures/simple-model/__generated__/fabbrica";

describe("sequence", () => {
  beforeEach(() => {
    resetSequence();
  });

  test("Define field value with sequence", async () => {
    const factory = defineUserFactory({
      defaultData: ({ seq }) => ({
        id: `model_${seq}`,
      }),
    });

    await expect(factory.build()).resolves.toMatchObject({ id: "model_0" });
    await expect(factory.build()).resolves.toMatchObject({ id: "model_1" });
  });
});
