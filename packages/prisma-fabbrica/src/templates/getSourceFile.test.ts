import { getDMMF } from "@prisma/internals";
import { printNode } from "talt";

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
    expect(printNode(sourceFile)).toMatchSnapshot();
  });
});
