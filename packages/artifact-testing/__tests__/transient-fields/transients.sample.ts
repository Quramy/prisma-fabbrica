import { defineUserFactory } from "../../fixtures/simple-model/__generated__/fabbrica";

export async function correctTypeTest() {
  const factoryWithoutTransientFields = defineUserFactory();
  await factoryWithoutTransientFields.create();

  const factoryWithTransientFields = defineUserFactory.withTransientFields({
    a: false,
    b: 0,
    c: "",
  })({
    defaultData: async ({ seq, a, b, c }) => ({
      name: `${seq}${a}${b}${c}`,
    }),
  });
  await factoryWithTransientFields.create();
}

export async function invalidTypeTest() {
  const UserFactory = defineUserFactory.withTransientFields({
    // @ts-expect-error Can't use field name defined from schema as transient field name
    id: "id",
  })();

  await UserFactory.build();
}
