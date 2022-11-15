export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: false }],
  },
  testEnvironment: "@quramy/jest-prisma-node/environment",
};
