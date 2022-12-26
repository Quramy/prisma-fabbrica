import { defineUserFactory, registerScalarFieldValueGenerator, resetSequence } from "./__generated__/fabbrica";

const prisma = jestPrisma.client;

const UserFactory = defineUserFactory();

registerScalarFieldValueGenerator({
  String: ({ modelName, fieldName, seq }) => (fieldName === "id" ? `${modelName}_id_${seq}` : seq + ""),
});

describe("factories", () => {
  describe("UserFactory", () => {
    beforeEach(async () => {
      resetSequence();
      await UserFactory.create();
    });

    it("creates record with customized scalar field", async () => {
      await expect(prisma.user.findUnique({ where: { id: "User_id_0" } })).resolves.not.toBeNull();
    });
  });
});
