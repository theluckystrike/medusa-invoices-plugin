const { loadEnv } = require("@medusajs/framework/utils")
loadEnv("test", process.cwd())

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
}

if (process.env.TEST_TYPE === "unit") {
  // No standalone unit tests currently — keep testMatch empty so the suite
  // passes without picking up DB-dependent integration tests.
  module.exports.testMatch = []
} else if (process.env.TEST_TYPE === "integration:http") {
  module.exports.testMatch = ["**/integration-tests/**/*.[jt]s"]
} else if (process.env.TEST_TYPE === "integration:modules") {
  module.exports.testMatch = ["**/src/modules/*/__tests__/**/*.[jt]s"]
}