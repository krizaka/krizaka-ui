import { defineConfig } from "tsup";

/** ESM + types: the client (`.`) and the React auth context (`./react`). The discovery client and React stay external. */
const declarations = { index: "src/index.ts", react: "src/react.tsx" };

export default defineConfig({
  entry: declarations,
  format: ["esm"],
  dts: { entry: declarations },
  sourcemap: true,
  clean: false,
  target: "es2022",
  splitting: true,
  external: [/^@krizaka\//, "react", "react/jsx-runtime"],
});
