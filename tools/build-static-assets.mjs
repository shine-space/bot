import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../site");
const sourceRoot = resolve(import.meta.dirname, "static-src");

async function joinFiles(files) {
  const contents = await Promise.all(
    files.map((file) => readFile(resolve(sourceRoot, file), "utf8")),
  );
  return `${contents.map((content) => content.trim()).join("\n")}\n`;
}

const css = await joinFiles([
  "css/bot.css",
  "css/site.css",
]);

const cssOptimized = css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .join("\n");

const runtimeBefore = await joinFiles([
  "js/deployment-base.js",
  "js/performance-config.js",
  "js/accessibility.js",
  "js/placeholder-nav.js",
  "js/loading-video.js",
  "js/background-audio.js",
  "js/product-preview-autoplay.js",
  "js/local-product-player.js",
  "js/inline-about.js",
  "js/section-wheel-snap.js",
]);

const runtimeAfter = await joinFiles([
  "js/product-scroll-background.js",
  "js/loading-autoplay.js",
  "js/scroll-arrow-sync.js",
]);

await Promise.all([
  writeFile(resolve(projectRoot, "assets/css/app.css"), `${cssOptimized}\n`),
  writeFile(resolve(projectRoot, "assets/js/runtime-before.js"), runtimeBefore),
  writeFile(resolve(projectRoot, "assets/js/runtime-after.js"), runtimeAfter),
]);
