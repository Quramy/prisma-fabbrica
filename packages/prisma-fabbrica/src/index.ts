import { generatorHandler } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";

generatorHandler({
  onManifest: () => ({
    prettyName: "fabbrica",
    defaultOutput: "../src/__generated__/factories",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: async options => {
    logger.log("onGenerate", options.generator.output?.value);
    logger.log("onGenerate", options.dmmf);
  },
});
