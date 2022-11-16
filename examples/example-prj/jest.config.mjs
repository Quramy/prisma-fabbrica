export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: false }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest/setupAfterEnv.ts"],
  testEnvironment: "@quramy/jest-prisma-node/environment",
  testEnvironmentOptions: {
    verboseQuery: true,
  },
};
