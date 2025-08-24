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

  it("generates TypeScript AST without ignored view", async () => {
    const dmmf = await getDMMF({
      datamodel: `
        generator client {
          provider        = "prisma-client-js"
          previewFeatures = ["views"]
        }
        
        model User {
          id Int @id
          name String
        }
      
        view IgnoredView {
          id Int @unique
          name String
        }
      `,
    });
    const sourceFile = getSourceFile({ document: dmmf, ignoredModelNames: ["IgnoredView"] });
    const printer = createPrinter();
    const printerOutput = printer.print(sourceFile);
    expect(printerOutput).not.toContain("IgnoredView");
  });

  it("generates TypeScript AST without ignored view relation", async () => {
    const dmmf = await getDMMF({
      datamodel: `
        generator client {
          provider        = "prisma-client-js"
          previewFeatures = ["views"]
        }
        
        model User {
          id Int @id
          name String
          IgnoredViewNotThis IgnoredView?
        }
      
        view IgnoredView {
          id Int @unique
          UserId Int @unique
          name String
          User User @relation(fields: [UserId], references: [id], onUpdate: NoAction)
        }
      `,
    });
    const sourceFile = getSourceFile({ document: dmmf, ignoredModelNames: ["IgnoredView"] });
    const printer = createPrinter();
    const printerOutput = printer.print(sourceFile);
    expect(printerOutput).not.toContain("type IgnoredViewUserFactory");
  });
});
