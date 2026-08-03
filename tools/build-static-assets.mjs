import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

async function joinFiles(files) {
  const contents = await Promise.all(
    files.map((file) => readFile(resolve(projectRoot, file), "utf8")),
  );
  return `${contents.map((content) => content.trim()).join("\n")}\n`;
}

const css = await joinFiles([
  "assets/css/bot.css",
  "assets/css/site.css",
]);

const cssOptimized = css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .join("\n");

const runtimeBefore = await joinFiles([
  "assets/js/deployment-base.js",
  "assets/js/performance-config.js",
  "assets/js/accessibility.js",
  "assets/js/placeholder-nav.js",
  "assets/js/loading-video.js",
  "assets/js/background-audio.js",
  "assets/js/product-preview-autoplay.js",
  "assets/js/local-product-player.js",
  "assets/js/inline-about.js",
  "assets/js/section-wheel-snap.js",
]);

const runtimeAfter = await joinFiles([
  "assets/js/product-scroll-background.js",
  "assets/js/loading-autoplay.js",
  "assets/js/scroll-arrow-sync.js",
]);

await Promise.all([
  writeFile(resolve(projectRoot, "assets/css/app.css"), `${cssOptimized}\n`),
  writeFile(resolve(projectRoot, "assets/js/runtime-before.js"), runtimeBefore),
  writeFile(resolve(projectRoot, "assets/js/runtime-after.js"), runtimeAfter),
]);
