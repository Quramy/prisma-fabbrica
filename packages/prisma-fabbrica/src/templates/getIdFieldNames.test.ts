import { getDMMF } from "@prisma/internals";

import { modelScalarOrEnumFields, getIdFieldNames } from ".";

describe(modelScalarOrEnumFields, () => {
  it.each([
    {
      pattern: "@id",
      datamodel: `
        model TestModel {
          id Int @id
        }
      `,
      expected: ["id"],
    },
    {
      pattern: "no PK but @unique",
      datamodel: `
        model TestModel {
          field1 Int @unique
          field2 Int @unique
        }
      `,
      expected: ["field1"],
    },
    {
      pattern: "Complex id",
      datamodel: `
        model TestModel {
          field1 Int
          field2 String
          @@id([field1, field2])
        }
      `,
      expected: ["field1", "field2"],
    },
    {
      pattern: "Complex unique key",
      datamodel: `
        model TestModel {
          field1 Int
          field2 Int
          @@unique([field1, field2])
        }
      `,
      expected: ["field1", "field2"],
    },
  ])("generates literal type field for $pattern", async ({ datamodel, expected }) => {
    const dmmf = await getDMMF({
      datamodel,
    });
    expect(getIdFieldNames(dmmf.datamodel.models[0])).toEqual(expected);
  });
});
