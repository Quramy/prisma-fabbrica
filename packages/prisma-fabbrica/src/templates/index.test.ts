import { getDMMF } from "@prisma/internals";
import { template, printNode } from "talt";

import { modelScalarFields, getSourceFile, findPrsimaCreateInputTypeFromModelName } from ".";

describe(modelScalarFields, () => {
  it("generates literal type field type pattern", async () => {
    const dmmf = await getDMMF({
      datamodel: `
        model TestModel {
          id Int @id
          boolField Boolean
          strField String
          floatField Float
          dateTimeField DateTime
        }
      `,
    });
    const inputType = findPrsimaCreateInputTypeFromModelName(dmmf, "TestModel");
    const expected = template.sourceFile`
      type TestModelScalarFields = {
        id: number;
        boolField: boolean;
        strField: string;
        floatField: number;
        dateTimeField: Date;
      }
    `();
    expect(printNode(modelScalarFields("TestModel", inputType))).toBe(printNode(expected).trim());
  });

  it("does not generate for nullable field", async () => {
    const dmmf = await getDMMF({
      datamodel: `
        model TestModel {
          id Int @id
          nullableField Int?
        }
      `,
    });
    const inputType = findPrsimaCreateInputTypeFromModelName(dmmf, "TestModel");
    const expected = template.sourceFile`
      type TestModelScalarFields = {
        id: number;
      }
    `();
    expect(printNode(modelScalarFields("TestModel", inputType))).toBe(printNode(expected).trim());
  });
});

describe(getSourceFile, () => {
  it("generates TypeScript AST", async () => {
    const dmmf = await getDMMF({
      datamodel: `
        model User {
          id Int @id
          name String
        }
      `,
    });
    const sourceFile = getSourceFile({ document: dmmf, importSpecifierToPrismaClient: "@prisma/client" });
    expect(printNode(sourceFile)).toMatchSnapshot();
  });
});
