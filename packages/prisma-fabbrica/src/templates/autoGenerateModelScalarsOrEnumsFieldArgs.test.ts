import { getDMMF } from "@prisma/internals";
import { printNode } from "talt";

import { autoGenerateModelScalarsOrEnumsFieldArgs, findPrsimaCreateInputTypeFromModelName } from ".";

describe(autoGenerateModelScalarsOrEnumsFieldArgs, () => {
  it.each([
    {
      datamodel: `
        model TestModel {
          id Int @id
        }
      `,
      targetField: "id",
      expected: `
        scalarFieldValueGenerator.Int({ modelName: "TestModel", fieldName: "id", isId: true, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          complexIdField  Int
          idField2        String
          @@id([complexIdField, idField2])
        }
      `,
      targetField: "complexIdField",
      expected: `
        scalarFieldValueGenerator.Int({ modelName: "TestModel", fieldName: "complexIdField", isId: true, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id Int @id
          uniqueField String @unique
        }
      `,
      targetField: "uniqueField",
      expected: `
        scalarFieldValueGenerator.String({ modelName: "TestModel", fieldName: "uniqueField", isId: false, isUnique: true, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          booleanField Boolean
        }
      `,
      targetField: "booleanField",
      expected: `
        scalarFieldValueGenerator.Boolean({ modelName: "TestModel", fieldName: "booleanField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          stringField String
        }
      `,
      targetField: "stringField",
      expected: `
        scalarFieldValueGenerator.String({ modelName: "TestModel", fieldName: "stringField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          intField Int
        }
      `,
      targetField: "intField",
      expected: `
        scalarFieldValueGenerator.Int({ modelName: "TestModel", fieldName: "intField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          floatField Float
        }
      `,
      targetField: "floatField",
      expected: `
        scalarFieldValueGenerator.Float({ modelName: "TestModel", fieldName: "floatField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          bigIntField BigInt
        }
      `,
      targetField: "bigIntField",
      expected: `
        scalarFieldValueGenerator.BigInt({ modelName: "TestModel", fieldName: "bigIntField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          dateTimeField DateTime
        }
      `,
      targetField: "dateTimeField",
      expected: `
        scalarFieldValueGenerator.DateTime({ modelName: "TestModel", fieldName: "dateTimeField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          bytesField Bytes
        }
      `,
      targetField: "bytesField",
      expected: `
        scalarFieldValueGenerator.Bytes({ modelName: "TestModel", fieldName: "bytesField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          jsonField Json
        }
      `,
      targetField: "jsonField",
      expected: `
        scalarFieldValueGenerator.Json({ modelName: "TestModel", fieldName: "jsonField", isId: false, isUnique: false, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id  Int @id
          enumField Color
        }
        enum Color {
          RED
          BLUE
          GREEN
        }
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }
      `,
      targetField: "enumField",
      expected: `"RED"`,
    },
  ])("generates expression node for $targetField", async ({ datamodel, targetField, expected }) => {
    const dmmf = await getDMMF({ datamodel });
    const model = dmmf.datamodel.models[0];
    const field = findPrsimaCreateInputTypeFromModelName(dmmf, "TestModel").fields.find(f => f.name === targetField)!;
    const enums = dmmf.schema.enumTypes.model ?? [];
    expect(printNode(autoGenerateModelScalarsOrEnumsFieldArgs(model, field, enums))).toBe(expected.trim());
  });
});
