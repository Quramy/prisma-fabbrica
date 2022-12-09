import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

import { generatorHandler } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";

import { getSourceFile } from "./templates";
import { createPrinter } from "./templates/ast-tools/printer";

function readTsConfig(tsconfigPath: string) {
  const opt: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
  };
  return existsSync(tsconfigPath)
    ? ts.getParsedCommandLineOfConfigFile(tsconfigPath, {}, ts.sys as any)?.options ?? opt
    : opt;
}

function compile(fileName: string, content: string, options: ts.CompilerOptions) {
  const fileMap = new Map<string, string>();
  const host = ts.createCompilerHost(options);
  host.readFile = fname => (fname === fileName ? content : ts.sys.readFile(fname));
  host.writeFile = (fname: string, contents: string) => fileMap.set(fname, contents);
  const program = ts.createProgram([fileName], options, host);
  program.emit();
  const js = fileMap.get(fileName.replace(".ts", ".js"))!;
  const dts = fileMap.get(fileName.replace(".ts", ".d.ts"))!;
  if (!js || !dts) {
    throw new Error('prisma-fabbrica: Failed to TypeScript transpilation. Please try "noTranspile = true"');
  }
  return { js, dts };
}

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
    const noTranspile = options.generator.config.noTranspile === "true" ?? false;
    const outputDirname = options.generator.output?.value;
    const clientGeneratorOutputPath = clientGeneratorConfig.output?.value;
    if (!clientGeneratorOutputPath || !outputDirname) {
      logger.error("No output value");
      return;
    }

    const prismaClientModuleSpecifier = clientGeneratorOutputPath.endsWith(
      ["node_modules", "@prisma", "client"].join(path.sep),
    )
      ? "@prisma/client"
      : "./" + path.relative(outputDirname, clientGeneratorOutputPath).replace("\\", "/");

    const printer = createPrinter();
    const contents = printer.print(getSourceFile({ document: options.dmmf, prismaClientModuleSpecifier }));

    await fs.rm(outputDirname, { recursive: true, force: true });
    await fs.mkdir(outputDirname, { recursive: true });

    if (noTranspile) {
      await fs.writeFile(path.join(outputDirname, "index.ts"), contents, "utf8");
    } else {
      const tsconfigPath = path.resolve(
        path.dirname(options.schemaPath),
        options.generator.config.tsconfig ?? "../tsconfig.json",
      );
      const compileOptions = readTsConfig(tsconfigPath);
      const output = compile(path.join(outputDirname, "index.ts"), contents, {
        ...compileOptions,
        noEmit: false,
        skipLibCheck: true,
        incremental: false,
        outDir: undefined,
        outFile: undefined,
        inlineSourceMap: undefined,
        sourceMap: false,
        declaration: true,
      });
      await Promise.all([
        fs.writeFile(path.join(outputDirname, "index.js"), output.js, "utf8"),
        fs.writeFile(path.join(outputDirname, "index.d.ts"), output.dts, "utf8"),
      ]);
    }
  },
});
