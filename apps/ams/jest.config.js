import nextJest from "next/jest.js";

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Test environment
  testEnvironment: "jest-environment-jsdom",

  // Module name mapper for path aliases (adjust to match your tsconfig paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@ams/domain/(.*)$": "<rootDir>/../../packages/domain/src/$1",
    "^@ams/contracts/(.*)$": "<rootDir>/../../packages/contracts/src/$1",
    "^@ams/db/(.*)$": "<rootDir>/../../packages/db/src/$1",
    "^@ams/application/(.*)$": "<rootDir>/../../packages/application/src/$1",
    "^@ams/auth/(.*)$": "<rootDir>/../../packages/auth/src/$1",
    "^@ams/config/(.*)$": "<rootDir>/../../packages/config/src/$1",
  },

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
  ],

  // Test match patterns
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
