import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { sourcemap: false },
  sourcemap: true,
  clean: true,
  target: "es2022",
  // package.json의 exports가 .js(esm)/.cjs(cjs) 확장자를 가정하므로 .mjs로 바뀌지 않게 고정
  fixedExtension: false,
  deps: {
    neverBundle: ["react", "react-dom"],
  },
});
