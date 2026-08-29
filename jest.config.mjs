import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-fixed-jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
};

export default createJestConfig(config);