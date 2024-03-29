import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { exec as execCallback } from "node:child_process";

import primsmaInternal from "@prisma/internals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { getDMMF } = primsmaInternal;
const exec = promisify(execCallback);

const fixturesDir = path.resolve(__dirname, "../fixtures");
const dirs = await fs.readdir(fixturesDir, { withFileTypes: true });

for (const { name } of dirs) {
  const schemaPath = path.resolve(fixturesDir, name, "schema.prisma");
  if (!existsSync(schemaPath)) continue;
  const schemaContents = await fs.readFile(schemaPath, "utf8");
  const dmmfDocument = await getDMMF({
    datamodel: schemaContents,
  });
  await fs.writeFile(path.resolve(fixturesDir, name, "dmmf.json"), JSON.stringify(dmmfDocument, null, 2), "utf8");
  const { stdout } = await exec(`NODE_ENV=development npx prisma generate --schema=${schemaPath}`);
  process.stdout.write(stdout);
}
