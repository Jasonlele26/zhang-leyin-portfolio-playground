import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const publicFiles = [
  "app.js",
  "i18n.js",
  "interactive.js",
  "playground-frame.html",
  "playground-frame.css",
  "playground-frame.js",
  "styles.css",
  "favicon.svg",
  "robots.txt",
  "_headers",
  "404.html"
];

for (const entry of publicFiles) {
  await cp(path.join(root, entry), path.join(dist, entry), {
    recursive: true,
    force: true
  });
}

let index = await readFile(path.join(root, "index.html"), "utf8");
index = index
  .replace(/\s*<link rel="stylesheet" href="editor\.css">/g, "")
  .replace(/\s*<script src="editor\.js"><\/script>/g, "")
  .replace(/\s*<a href="editor\.html">Site editor<\/a>/g, "");

if (/editor\.(css|js|html)|Site editor/.test(index)) {
  throw new Error("Editor files are still referenced in the public build.");
}

await writeFile(path.join(dist, "index.html"), index, "utf8");

const app = await readFile(path.join(root, "app.js"), "utf8");
const css = await readFile(path.join(root, "styles.css"), "utf8");
const assetReferences = new Set();
const assetPattern = /assets\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|svg|woff2|pdf)/gi;

for (const text of [index, app, css]) {
  for (const match of text.matchAll(assetPattern)) {
    assetReferences.add(match[0]);
  }
}

for (const reference of assetReferences) {
  const source = path.join(root, reference);
  const destination = path.join(dist, reference);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

await cp(
  path.join(root, "assets", "fonts"),
  path.join(dist, "assets", "fonts"),
  { recursive: true, force: true }
);

await cp(
  path.join(root, "assets", "teachable"),
  path.join(dist, "assets", "teachable"),
  { recursive: true, force: true }
);

await cp(
  path.join(root, "assets", "mediapipe"),
  path.join(dist, "assets", "mediapipe"),
  { recursive: true, force: true }
);

console.log(`Public site built at ${dist}`);
