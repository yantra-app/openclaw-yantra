import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  target: "node18",
  splitting: false,
  shims: false,
  external: ["openclaw", "openclaw/plugin-sdk", "openclaw/plugin-sdk/plugin-entry"],
  noExternal: ["envalid", "@ai-sdk/provider"],
});
