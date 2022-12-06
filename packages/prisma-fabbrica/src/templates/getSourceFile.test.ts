import ts from "typescript";
import { getDMMF } from "@prisma/internals";

import { getSourceFile } from ".";

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
    const sourceFile = getSourceFile({ document: dmmf });
    const printer = ts.createPrinter({
      removeComments: false,
      newLine: ts.NewLineKind.LineFeed,
      omitTrailingSemicolon: false,
    });
    expect(printer.printFile(sourceFile)).toMatchSnapshot();
  });
});
