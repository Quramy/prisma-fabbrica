import { getClientModuleSpecifier } from "./getClientModuleSpecifier";

describe(getClientModuleSpecifier, () => {
  test.each([
    { outputDirname: "dist", clientGeneratorOutputPath: undefined, expected: "@prisma/client" },
    { outputDirname: "dist", clientGeneratorOutputPath: "node_modules/@prisma/client", expected: "@prisma/client" },
    { outputDirname: "dist", clientGeneratorOutputPath: "node_modules\\@prisma\\client", expected: "@prisma/client" },
    { outputDirname: "dist", clientGeneratorOutputPath: "prisma-client", expected: "../prisma-client/index.js" },
    { outputDirname: "dist", clientGeneratorOutputPath: "../prisma-client", expected: "../../prisma-client/index.js" },
    {
      outputDirname: "./dist",
      clientGeneratorOutputPath: "../prisma-client",
      expected: "../../prisma-client/index.js",
    },
    {
      outputDirname: ".\\dist",
      clientGeneratorOutputPath: "..\\prisma-client",
      expected: "../../prisma-client/index.js",
    },
    {
      outputDirname: "dist",
      clientGeneratorOutputPath: "..\\..\\prisma-client",
      expected: "../../../prisma-client/index.js",
    },
  ])(
    "outputDirname: $outputDirname, clientGeneratorOutputPath: $clientGeneratorOutputPath, expected: $expected",
    ({ outputDirname, clientGeneratorOutputPath, expected }) => {
      expect(getClientModuleSpecifier(clientGeneratorOutputPath, outputDirname)).toBe(expected);
    },
  );
});
