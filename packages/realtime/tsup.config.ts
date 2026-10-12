import { defineConfig } from "tsup";

/** ESM + types, one entry per sub-path; the drivers (pg, ioredis) stay external peers, loaded only by their entry. */
export default defineConfig({
  entry: {
    index: "src/index.ts",
    sse: "src/sse.ts",
    postgres: "src/postgres.ts",
    pg: "src/pg.ts",
    redis: "src/redis.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["pg", "ioredis"],
});
