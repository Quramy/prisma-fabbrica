import fs from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

import { generatorHandler } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";

import { getSourceFile } from "./templates";

generatorHandler({
  onManifest: () => ({
    prettyName: "fabbrica",
    defaultOutput: "../src/__generated__/fabbrica.ts",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: async options => {
    const clientGeneratorConfig = options.otherGenerators.find(generatorConfig => generatorConfig.name === "client");
    if (!clientGeneratorConfig) {
      logger.error("No prisma client generator.");
      return;
    }
    const outputPath = options.generator.output?.value;
    const clientGeneratorOutputPath = clientGeneratorConfig.output?.value;
    if (!clientGeneratorOutputPath || !outputPath) {
      logger.error("no output value");
      return;
    }

    const importSpecifierToPrismaClient = clientGeneratorOutputPath.endsWith(
      ["node_modules", "@prisma", "client"].join(path.sep),
    )
      ? "@prisma/client"
      : "./" + path.relative(path.dirname(outputPath), clientGeneratorOutputPath).replace("\\", "/");

    const printer = ts.createPrinter({
      omitTrailingSemicolon: false,
      removeComments: false,
    });
    const contents = printer.printFile(getSourceFile({ document: options.dmmf, importSpecifierToPrismaClient }));
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, contents, "utf8");
  },
});
