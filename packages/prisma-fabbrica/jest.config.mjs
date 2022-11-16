export default {
  preset: "ts-jest",
  testPathIgnorePatterns: ["<rootDir>/lib/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: false }],
  },
};
