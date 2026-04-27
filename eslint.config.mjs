import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

if (process.env.NX_DAEMON == null) {
  process.env.NX_DAEMON = "false";
}

if (process.env.NX_ISOLATE_PLUGINS == null) {
  process.env.NX_ISOLATE_PLUGINS = "false";
}

const { default: nxPlugin } = await import("@nx/eslint-plugin");

const newAppSharedAliasRestrictions = [
  {
    group: ["@/db", "@/db/*"],
    message: "Use @ams/db imports for shared database code.",
  },
  {
    group: ["@/domain/*"],
    message: "Use @ams/domain/* imports for shared domain code.",
  },
  {
    group: [
      "@/types/database",
      "@/types/lessons",
      "@/types/lesson-form",
      "@/types/lesson-routines",
    ],
    message: "Use @ams/db/* or @ams/contracts/* type entrypoints for shared types.",
  },
];

const packageBoundaryRestrictions = [
  {
    group: ["apps/*", "workers/*"],
    message: "Packages must not import apps or workers.",
  },
];

const authBoundaryRestrictions = [
  ...packageBoundaryRestrictions,
  {
    group: ["@/application/*", "@/auth/*"],
    message: "packages/auth must not depend on app/application aliases.",
  },
];

const permissionsBoundaryRestrictions = [
  ...packageBoundaryRestrictions,
  {
    group: ["@/db", "@/db/*", "@/application/*", "@/auth/*", "@/env/*", "@/types/*"],
    message:
      "packages/permissions must stay pure and must not depend on db, application, auth runtime, config, or compatibility aliases.",
  },
];

const contractsBoundaryRestrictions = [
  ...packageBoundaryRestrictions,
  {
    group: ["@/db", "@/db/*", "@/db/schema", "@/db/schema/*", "@/types/database"],
    message: "packages/contracts must not depend on db-layer types or schema.",
  },
];

const applicationBoundaryRestrictions = [
  ...packageBoundaryRestrictions,
  {
    group: [
      "@/db",
      "@/db/*",
      "@/domain/*",
      "@/env/*",
      "@/types/database",
      "@/types/lessons",
      "@/types/lesson-form",
      "@/types/lesson-routines",
      "@/types/assessments",
    ],
    message: "packages/application must import shared packages through @ams/* entrypoints.",
  },
];

const cleanedDomainModelRestrictions = [
  {
    group: [
      "@/db",
      "@/db/*",
      "@/db/schema",
      "@/db/schema/*",
      "@/types/*",
      "@/utils/*",
      "@ams/contracts",
      "@ams/contracts/*",
    ],
    message:
      "packages/domain must stay domain-owned and must not depend on db schema, contracts, or shared app compatibility aliases.",
  },
];

const cleanedDbSliceRestrictions = [
  {
    group: ["@/domain/*", "@/utils/*", "@/types/*"],
    message:
      "This db slice must use explicit @ams/domain imports or package-local helpers/types instead of legacy cross-package aliases.",
  },
];

const eslintConfig = [
  {
    ignores: [
      "**/__tests__/**",
      "**/.next/**",
      "**/.nx/**",
      "**/node_modules/**",
      "out/**",
      "coverage/**",
      "src/**",
      "**/*.tsbuildinfo",
    ],
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    plugins: ["check-file", "n"],
    rules: {
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      semi: ["error"],
      quotes: ["error", "double"],
      "n/no-process-env": ["error"],
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  }),
  {
    files: [
      "**/jest.setup.js",
      "**/jest.config.js",
      "**/tailwind.config.ts",
      "**/tailwind.config.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: [
      "eslint.config.mjs",
      "apps/*/src/env/**/*.{ts,tsx,js,jsx}",
      "apps/*/src/application/reports/puppeteer.ts",
      "packages/config/src/env/**/*.{ts,tsx,js,jsx}",
    ],
    rules: {
      "n/no-process-env": "off",
    },
  },
  {
    files: [
      "apps/api/src/**/*.{ts,tsx,js,jsx}",
      "apps/portal/src/**/*.{ts,tsx,js,jsx}",
      "apps/ams/src/**/*.{ts,tsx,js,jsx}",
      "packages/*/src/**/*.ts",
      "packages/*/src/**/*.tsx",
      "packages/*/src/**/*.js",
      "packages/*/src/**/*.jsx",
    ],
    plugins: {
      "@nx": nxPlugin,
    },
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "type:app",
              onlyDependOnLibsWithTags: [
                "type:package",
                "layer:application",
                "layer:auth",
                "layer:contracts",
                "layer:permissions",
                "layer:observability",
                "layer:config",
                "layer:domain",
                "layer:db",
              ],
            },
            {
              sourceTag: "layer:domain",
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: "layer:contracts",
              onlyDependOnLibsWithTags: ["layer:domain"],
            },
            {
              sourceTag: "layer:permissions",
              onlyDependOnLibsWithTags: ["layer:domain", "layer:contracts"],
            },
            {
              sourceTag: "layer:auth",
              onlyDependOnLibsWithTags: [
                "layer:domain",
                "layer:contracts",
                "layer:permissions",
              ],
            },
            {
              sourceTag: "layer:db",
              onlyDependOnLibsWithTags: [
                "layer:domain",
                "layer:contracts",
                "layer:config",
              ],
            },
            {
              sourceTag: "layer:application",
              onlyDependOnLibsWithTags: [
                "layer:domain",
                "layer:contracts",
                "layer:db",
                "layer:auth",
                "layer:permissions",
                "layer:observability",
                "layer:config",
              ],
            },
            {
              sourceTag: "layer:config",
              onlyDependOnLibsWithTags: ["layer:contracts"],
            },
            {
              sourceTag: "layer:observability",
              onlyDependOnLibsWithTags: ["layer:contracts"],
            },
          ],
        },
      ],
    },
  },
  {
    files: ["apps/api/src/**/*.{ts,tsx,js,jsx}", "apps/portal/src/**/*.{ts,tsx,js,jsx}", "apps/ams/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: newAppSharedAliasRestrictions }],
    },
  },
  {
    files: ["packages/**/*.ts", "packages/**/*.tsx", "packages/**/*.js", "packages/**/*.jsx"],
    rules: {
      "no-restricted-imports": ["error", { patterns: packageBoundaryRestrictions }],
    },
  },
  {
    files: ["packages/auth/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: authBoundaryRestrictions }],
    },
  },
  {
    files: ["packages/permissions/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: permissionsBoundaryRestrictions }],
    },
  },
  {
    files: ["packages/contracts/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: contractsBoundaryRestrictions }],
    },
  },
  {
    files: ["packages/contracts/src/**/*.d.ts"],
    rules: {
      "@nx/enforce-module-boundaries": "off",
    },
  },
  {
    files: ["packages/application/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: applicationBoundaryRestrictions }],
    },
  },
  {
    files: ["packages/domain/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: cleanedDomainModelRestrictions }],
    },
  },
  {
    files: ["packages/db/src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: cleanedDbSliceRestrictions }],
    },
  },
];

export default eslintConfig;
