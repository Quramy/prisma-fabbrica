import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({
  diagnostics: false,
});

export default {
  ...presetConfig,
  testEnvironment: "@quramy/jest-prisma-node/environment",
  setupFilesAfterEnv: ["./setupAfterEnv.ts", "@quramy/prisma-fabbrica/scripts/jest-prisma"],
  testEnvironmentOptions: {
    verboseQuery: true,
  },
} satisfies Config;
