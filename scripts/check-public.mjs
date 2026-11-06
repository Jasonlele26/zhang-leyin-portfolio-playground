import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

const files = await walk(dist);
const relativeFiles = files.map((file) => path.relative(dist, file).replaceAll("\\", "/"));
const forbidden = relativeFiles.filter((file) =>
  /(^|\/)editor\.(html|css|js)$/.test(file)
);

if (forbidden.length) {
  throw new Error(`Editor files found in public build: ${forbidden.join(", ")}`);
}

const index = await readFile(path.join(dist, "index.html"), "utf8");
if (/editor\.(css|js|html)|Site editor/.test(index)) {
  throw new Error("The public index still references the private editor.");
}

const references = new Set();
for (const match of index.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const reference = match[1];
  if (
    reference.startsWith("#") ||
    reference.startsWith("?") ||
    reference.startsWith("http://") ||
    reference.startsWith("https://") ||
    reference.startsWith("data:")
  ) {
    continue;
  }
  references.add(reference.split(/[?#]/)[0]);
}

const publicTextFiles = files.filter((file) =>
  /\.(html|css|js)$/i.test(file)
);
for (const file of publicTextFiles) {
  const text = await readFile(file, "utf8");
  const found = [
    ...text.matchAll(/url\("([^"]+)"\)/g),
    ...text.matchAll(/"((?:\.\.\/|assets\/)[^"]+)"/g),
    ...text.matchAll(/'(assets\/[^']+)'/g)
  ];
  for (const match of found) {
    const reference = match[1];
    if (
      reference.startsWith("data:") ||
      /^https?:\/\//.test(reference)
    ) {
      continue;
    }
    const resolved = path.relative(
      dist,
      path.resolve(path.dirname(file), reference)
    ).replaceAll("\\", "/");
    references.add(resolved);
  }
}

const missing = [];
for (const reference of references) {
  try {
    await access(path.join(dist, reference));
  } catch {
    missing.push(reference);
  }
}

if (missing.length) {
  throw new Error(`Missing public references: ${missing.join(", ")}`);
}

const textFiles = publicTextFiles.concat(files.filter((file) =>
  /\.(html|css|js|json|txt|xml|webmanifest)$/i.test(file)
));
const secretPatterns = [
  /W09-[A-Z0-9-]+/i,
  /CLOUDFLARE_API_TOKEN/i,
  /GITHUB_TOKEN/i,
  /SUPABASE_SERVICE_ROLE_KEY/i,
  /github_pat_[A-Za-z0-9_]+/
];
const leakedSecrets = [];

for (const file of new Set(textFiles)) {
  const text = await readFile(file, "utf8");
  if (secretPatterns.some((pattern) => pattern.test(text))) {
    leakedSecrets.push(path.relative(dist, file));
  }
}

if (leakedSecrets.length) {
  throw new Error(`Possible secrets in public files: ${leakedSecrets.join(", ")}`);
}

let totalBytes = 0;
for (const file of files) totalBytes += (await stat(file)).size;

console.log(
  JSON.stringify(
    {
      files: files.length,
      totalBytes,
      references: references.size,
      editorFiles: 0,
      missingReferences: 0,
      possibleSecrets: 0
    },
    null,
    2
  )
);
