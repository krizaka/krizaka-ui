import { defineConfig } from "vitest/config";

// The adapters without a server (memory, presence, SSE, the PostgreSQL bus over a fake channel, pgChannel over a fake
// driver) are fully tested here; the Redis adapter runs against a real server in test/bus.integration.test.ts
// (REALTIME_IT=1, the CI job "Realtime adapters").
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/redis.ts"],
      reporter: ["text", "lcov"],
      thresholds: { functions: 100, lines: 100, statements: 100, branches: 100 },
    },
  },
});
