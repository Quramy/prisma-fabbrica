import _path from "node:path";

const path = _path.posix;

export function getClientModuleSpecifier(clientGeneratorOutputPath: string | undefined, outputDirname: string) {
  if (!clientGeneratorOutputPath) {
    return "@prisma/client";
  }
  const clientGeneratorOutputPosixPath = clientGeneratorOutputPath.replace(/\\/g, path.sep);
  const outputPosixDirname = outputDirname.replace(/\\/g, path.sep);

  const prismaClientModuleSpecifier = path
    .normalize(clientGeneratorOutputPosixPath)
    .endsWith(["node_modules", "@prisma", "client"].join(path.sep))
    ? "@prisma/client"
    : path.normalize(path.join(".", path.relative(outputPosixDirname, clientGeneratorOutputPosixPath), "client.js"));
  return prismaClientModuleSpecifier;
}
