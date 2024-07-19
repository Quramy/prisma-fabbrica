import { defineEnumModelFactory } from "../../fixtures/field-variation/__generated__/fabbrica";

describe("enum", () => {
  test("fill required enum field", async () => {
    const factory = defineEnumModelFactory();

    const actual = await factory.build();

    expect(actual.requiredEnum).toBeTruthy();
    expect(actual.requiredEnumWithDefault).toBeFalsy();
    expect(actual.optionalEnum).toBeFalsy();
    expect(actual.enumerableEnum).toBeFalsy();
  });
});
