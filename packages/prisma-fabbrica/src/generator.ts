import fs from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

import { generatorHandler } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";

import { getSourceFile } from "./templates";

generatorHandler({
  onManifest: () => ({
    prettyName: "fabbrica",
    defaultOutput: "../src/__generated__/factories.ts",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: async options => {
    logger.info("onGenerate", options.generator.output?.value);
    logger.info("onGenerate", options.dmmf);
    const outputPath = options.generator.output?.value;
    if (!outputPath) {
      logger.warn("no output value");
      return;
    }
    const printer = ts.createPrinter({
      omitTrailingSemicolon: false,
      removeComments: false,
    });
    const contents = printer.printFile(getSourceFile(options.dmmf));
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, contents, "utf8");
  },
});
