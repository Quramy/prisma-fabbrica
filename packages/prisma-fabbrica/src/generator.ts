import fs from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

import { generatorHandler } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";

import { getSourceFile } from "./templates";

generatorHandler({
  onManifest: () => ({
    prettyName: "fabbrica",
    defaultOutput: "../src/__generated__/fabbrica",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: async options => {
    const clientGeneratorConfig = options.otherGenerators.find(generatorConfig => generatorConfig.name === "client");
    if (!clientGeneratorConfig) {
      logger.error("No prisma client generator.");
      return;
    }
    const outputDirname = options.generator.output?.value;
    const clientGeneratorOutputPath = clientGeneratorConfig.output?.value;
    if (!clientGeneratorOutputPath || !outputDirname) {
      logger.error("no output value");
      return;
    }

    const prismaClientModuleSpecifier = clientGeneratorOutputPath.endsWith(
      ["node_modules", "@prisma", "client"].join(path.sep),
    )
      ? "@prisma/client"
      : "./" + path.relative(outputDirname, clientGeneratorOutputPath).replace("\\", "/");

    const printer = ts.createPrinter({
      omitTrailingSemicolon: false,
      removeComments: false,
    });
    const contents = printer.printFile(getSourceFile({ document: options.dmmf, prismaClientModuleSpecifier }));
    await fs.mkdir(path.dirname(path.join(outputDirname, "index")), { recursive: true });
    await fs.writeFile(path.join(outputDirname, "index.ts"), contents, "utf8");
  },
});
