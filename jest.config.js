import nextJest from "next/jest.js";

// Workspace-level compatibility shim that points Jest at the legacy app.
const createJestConfig = nextJest({
  dir: "./apps/legacy",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ["<rootDir>/apps/legacy/jest.setup.js"],

  // Test environment
  testEnvironment: "jest-environment-jsdom",

  // Module name mapper for path aliases (adjust to match your tsconfig paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/apps/legacy/src/$1",
    "^@/components/(.*)$": "<rootDir>/apps/legacy/src/components/$1",
    "^@/lib/(.*)$": "<rootDir>/apps/legacy/src/lib/$1",
    "^@/services/(.*)$": "<rootDir>/apps/legacy/src/services/$1",
    "^@/hooks/(.*)$": "<rootDir>/apps/legacy/src/hooks/$1",
  },

  // Coverage configuration
  collectCoverageFrom: [
    "apps/legacy/src/**/*.{js,jsx,ts,tsx}",
    "!apps/legacy/src/**/*.d.ts",
    "!apps/legacy/src/**/*.stories.{js,jsx,ts,tsx}",
    "!apps/legacy/src/**/__tests__/**",
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
