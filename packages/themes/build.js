import esbuild from "esbuild";
import pkg from "./package.json" assert { type: "json" };

const dev = process.argv.includes("--dev");
const minify = !dev;

const watch = process.argv.includes("--watch");

const external = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

const baseConfig = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  target: "es2019",
  sourcemap: true,
  platform: "node",
  minify,
  watch,
  external,
};

Promise.all([
  esbuild.build({
    ...baseConfig,
    outfile: "./dist/bundle.esm.js", // ESM 버전
    format: "esm",
  }),
  esbuild.build({
    ...baseConfig,
    outfile: "./dist/bundle.cjs.js", // CommonJS 버전
    format: "cjs",
    outExtension: {
      ".js": ".cjs",
    },
  }),
]).catch(() => {
  console.error("BUILD FAILED");
  process.exit(1);
});
