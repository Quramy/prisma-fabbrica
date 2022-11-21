import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { exec as execCallback } from "node:child_process";
import { getDMMF } from "@prisma/internals";

const exec = promisify(execCallback);

async function main() {
  const fixturesDir = path.resolve(__dirname, "../fixtures");
  const dirs = await fs.readdir(fixturesDir);
  for (const fixtureDir of dirs) {
    const schemaPath = path.resolve(fixturesDir, fixtureDir, "schema.prisma");
    await exec(`npx prisma generate --schema=${schemaPath}`);
    const schemaContents = await fs.readFile(schemaPath, "utf8");
    const dmmfDocument = await getDMMF({
      datamodel: schemaContents,
    });
    await fs.writeFile(
      path.resolve(fixturesDir, fixtureDir, "dmmf.json"),
      JSON.stringify(dmmfDocument, null, 2),
      "utf8",
    );
  }
}

main();
