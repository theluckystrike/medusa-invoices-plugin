/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      "@/admin": "/src/admin",
    },
  },
  test: {
    setupFiles: "./src/admin/setup-test.ts",
    coverage: {
      reporter: ["lcov", "text"],
      include: ["src/admin/**/*.{ts,tsx}"],
      exclude: ["**/*.spec.{ts,tsx}", "**/*.test.{ts,tsx}", "**/vite-env.d.ts", "**/tsconfig.json"],
    },
    globals: true,
    environment: "jsdom",
    css: false,
    include: ["src/admin/**/*.{test,spec}.{ts,tsx}"],
  },
});