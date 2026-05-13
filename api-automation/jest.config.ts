import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["**/tests/**/*.spec.ts"],
  moduleNameMapper: {
    "^@test-data/(.*)$": "<rootDir>/test-data/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  globalSetup: "./src/helpers/global.setup.ts",
  testTimeout: 30000,

  // Coverage — enabled via `npm run test:coverage` (--coverage flag)
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/types/**",
    "!src/helpers/global.setup.ts",
  ],
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  // Note: branch threshold is 50% because uncovered branches are defensive
  // nullish-coalescing fallbacks that are never triggered in a properly
  // configured integration-test environment (env vars always set via .env).
  coverageThreshold: {
    global: {
      lines: 90,
      functions: 90,
      branches: 50,
      statements: 90,
    },
  },

  // Reporters
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "ShopEasy API — Execution Report",
        outputPath: "reports/execution-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        includeSuiteFailure: true,
        dateFormat: "yyyy-mm-dd HH:MM:ss",
        sort: "status",
        theme: "defaultTheme",
      },
    ],
    [
      "jest-junit",
      {
        outputDirectory: "reports",
        outputName: "junit-report.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " > ",
        usePathForSuiteName: true,
      },
    ],
  ],

  verbose: true,
};

export default config;
