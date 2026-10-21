import { defineConfig } from "tsup";

/** ESM + types: the client (`.`, with its verifier), the signer (`./sign`, build tooling) and the React bindings. */
const declarations = { index: "src/index.ts", sign: "src/sign.ts", react: "src/react.tsx" };

export default defineConfig({
  entry: declarations,
  format: ["esm"],
  dts: { entry: declarations },
  sourcemap: true,
  clean: false,
  target: "es2022",
  splitting: true,
  external: ["react", "react/jsx-runtime", /^@noble\//],
});
