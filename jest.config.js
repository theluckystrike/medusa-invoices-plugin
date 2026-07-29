const { loadEnv } = require("@medusajs/framework/utils");
loadEnv("test", process.cwd());

module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true, tsx: true },
          target: "es2021",
          transform: {
            react: { runtime: "automatic" },
          },
        },
      },
    ],
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  modulePathIgnorePatterns: ["dist/"],
  setupFiles: ["./integration-tests/setup.js"],
  // Mock @react-pdf/renderer (ESM-only) so it can be require()'d in Jest's
  // CJS environment. Without this every test that (transitively) loads the
  // invoice templates fails with "Must use import to load ES Module".
  moduleNameMapper: {
    "^@react-pdf/renderer$": "<rootDir>/__mocks__/@react-pdf/renderer.js",
  },
};

if (process.env.TEST_TYPE === "unit") {
  // There are no standalone unit tests — all tests need a database.  Use a
  // pattern that can never match a real file path so Jest finds nothing and
  // exits 0 (combined with --passWithNoTests).
  module.exports.testMatch = ["**/__NEVER_MATCHES_UNIT__/**"];
} else if (process.env.TEST_TYPE === "integration:http") {
  // Only match actual spec files — exclude setup.js and other helpers.
  module.exports.testMatch = ["**/integration-tests/**/*.spec.[jt]s"];
} else if (process.env.TEST_TYPE === "integration:modules") {
  module.exports.testMatch = ["**/src/modules/*/__tests__/**/*.[jt]s"];
}
