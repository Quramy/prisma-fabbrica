import { generatorHandler } from "@prisma/generator-helper";
import { onGenerate } from "./onGenerate";

generatorHandler({
  onManifest: () => ({
    prettyName: "fabbrica",
    defaultOutput: "../src/__generated__/fabbrica",
    requiresGenerators: ["prisma-client"],
  }),
  onGenerate,
});
