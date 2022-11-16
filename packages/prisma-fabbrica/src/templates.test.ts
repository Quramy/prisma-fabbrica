import { getDMMF } from "@prisma/internals";
import { printNode } from "talt";

import { getSourceFile } from "./templates";

describe(getSourceFile, () => {
  it("generates TypeScript AST", async () => {
    const dmmf = await getDMMF({
      datamodel: `
      datasource db {
        provider = "sqlite"
        url      = "file:dev.db"
      }
      model User {
        id Int @id
        name String
      }
    `,
    });
    const sourceFile = getSourceFile(dmmf);
    expect(printNode(sourceFile)).toMatchSnapshot();
  });
});
