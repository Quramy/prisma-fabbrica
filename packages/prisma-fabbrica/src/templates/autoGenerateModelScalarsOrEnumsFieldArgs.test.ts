import { getDMMF } from "@prisma/internals";
import { printNode } from "talt";

import { autoGenerateModelScalarsOrEnumsFieldArgs, findPrismaCreateInputTypeFromModelName } from ".";

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
        getScalarFieldValueGenerator().Int({ modelName: "TestModel", fieldName: "id", isId: true, isUnique: false, seq })
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
        getScalarFieldValueGenerator().Int({ modelName: "TestModel", fieldName: "complexIdField", isId: true, isUnique: false, seq })
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
        getScalarFieldValueGenerator().String({ modelName: "TestModel", fieldName: "uniqueField", isId: false, isUnique: true, seq })
      `,
    },
    {
      datamodel: `
        model TestModel {
          id Int @id
          uniqueField1 String
          uniqueField2 String
          @@unique([uniqueField1, uniqueField2])
        }
      `,
      targetField: "uniqueField1",
      expected: `
        getScalarFieldValueGenerator().String({ modelName: "TestModel", fieldName: "uniqueField1", isId: false, isUnique: true, seq })
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
        getScalarFieldValueGenerator().Boolean({ modelName: "TestModel", fieldName: "booleanField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().String({ modelName: "TestModel", fieldName: "stringField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().Int({ modelName: "TestModel", fieldName: "intField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().Float({ modelName: "TestModel", fieldName: "floatField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().BigInt({ modelName: "TestModel", fieldName: "bigIntField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().DateTime({ modelName: "TestModel", fieldName: "dateTimeField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().Bytes({ modelName: "TestModel", fieldName: "bytesField", isId: false, isUnique: false, seq })
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
        getScalarFieldValueGenerator().Json({ modelName: "TestModel", fieldName: "jsonField", isId: false, isUnique: false, seq })
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
    const field = findPrismaCreateInputTypeFromModelName(dmmf, "TestModel")?.fields.find(f => f.name === targetField)!;
    const enums = dmmf.schema.enumTypes.model ?? [];
    expect(printNode(autoGenerateModelScalarsOrEnumsFieldArgs(model, field, enums))).toBe(expected.trim());
  });
});
