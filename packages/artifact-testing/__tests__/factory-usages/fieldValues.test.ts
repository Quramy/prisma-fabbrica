import {
  defineUserFactory,
  registerScalarFieldValueGenerator,
  resetScalarFieldValueGenerator,
} from "../../fixtures/simple-model/__generated__/fabbrica";

describe("field values", () => {
  beforeEach(() => {
    resetScalarFieldValueGenerator();
  });

  test("factory fills required field", async () => {
    const factory = defineUserFactory();

    const actual = await factory.build();

    expect(actual.name).toBeTruthy();
  });

  describe("patterns of field value provider", () => {
    test("Provide field value passing parameters of build or create method", async () => {
      const factory = defineUserFactory();

      const actual = await factory.build({
        name: "User name",
      });

      expect(actual.name).toBe("User name");
    });

    test("Provide default field value using factory's defaultData object", async () => {
      const factory = defineUserFactory({
        defaultData: {
          name: "User name",
        },
      });

      const actual = await factory.build();

      expect(actual.name).toBe("User name");
    });

    test("Provide default field value using factory's defaultData function", async () => {
      const genName = () => "User name";
      const factory = defineUserFactory({
        defaultData: async () => ({
          name: genName(),
        }),
      });

      const actual = await factory.build();

      expect(actual.name).toBe("User name");
    });

    test("Provide default field value using ScalarFieldValueGenerator", async () => {
      registerScalarFieldValueGenerator({
        String: ({ modelName, fieldName }) => {
          if (modelName === "User" && fieldName === "name") {
            return "User name";
          }
          return "";
        },
      });
      const factory = defineUserFactory();

      const actual = await factory.build();

      expect(actual.name).toBe("User name");
    });
  });
});
