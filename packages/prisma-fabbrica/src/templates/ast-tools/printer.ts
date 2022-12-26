import ts from "typescript";

export function createPrinter() {
  const printer = ts.createPrinter({
    removeComments: false,
    newLine: ts.NewLineKind.LineFeed,
    omitTrailingSemicolon: false,
  });

  return {
    print(sourceFile: ts.SourceFile) {
      const tmp = printer.printFile(sourceFile);
      return tmp.replace(/\/\/\s*%BR%/g, "");
    },
  };
}
