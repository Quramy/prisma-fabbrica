import { getDMMF } from "@prisma/internals";

import { getSourceFile } from ".";
import { createPrinter } from "./ast-tools/printer";

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
    const printer = createPrinter();
    expect(printer.print(sourceFile)).toMatchSnapshot();
  });
});
