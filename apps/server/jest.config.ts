import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@collabx/types$": "<rootDir>/../../packages/types/index.ts",
    "^@collabx/types/(.*)$": "<rootDir>/../../packages/types/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
