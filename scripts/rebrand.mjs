// One-off: migrate dark-theme token classes to the light WejdenSpire brand.
// Run: node scripts/rebrand.mjs
import fs from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "src", "app");

// Order matters — longest/most-specific first.
const MAP = [
  // backgrounds / canvas
  ["bg-ws-terminal", "bg-ws-hero"],
  ["from-ws-ink-700/80 to-ws-ink-800/80", "from-ws-cloud to-white"],
  ["bg-gradient-to-br from-ws-ink-700/80 to-ws-ink-800/80", "bg-ws-soft-green"],
  ["bg-ws-ink-900/80", "bg-white/85"],
  ["bg-ws-ink-900/50", "bg-ws-cloud"],
  ["bg-ws-ink-900", "bg-white"],
  ["bg-ws-ink-800/80", "bg-white"],
  ["bg-ws-ink-800/60", "bg-ws-cloud"],
  ["bg-ws-ink-800/50", "bg-ws-cloud"],
  ["bg-ws-ink-800", "bg-ws-cloud"],
  ["bg-ws-ink-700/70", "bg-white"],
  ["bg-ws-ink-700/60", "bg-white"],
  ["bg-ws-ink-700/50", "bg-white"],
  ["bg-ws-ink-700/40", "bg-ws-cloud"],
  ["bg-ws-ink-700", "bg-ws-cloud"],
  ["bg-ws-ink-600", "bg-ws-cloud"],
  // borders
  ["border-ws-grid/60", "border-ws-border"],
  ["border-ws-grid/50", "border-ws-border"],
  ["border-ws-grid/40", "border-ws-border"],
  ["border-ws-grid", "border-ws-border"],
  ["border-t-0 border-ws-border", "border-t-0 border-ws-border"],
  // accent (orange) -> purple/primary depending on usage handled later; default accent->primary
  ["text-ws-accent", "text-ws-primary"],
  ["bg-ws-accent/5", "bg-ws-soft-purple"],
  ["bg-ws-accent/10", "bg-ws-purple/10"],
  ["border-ws-accent/30", "border-ws-purple/25"],
  ["border-ws-accent/50", "border-ws-purple/40"],
  ["border-ws-accent", "border-ws-purple"],
  ["text-ws-primary", "text-ws-primary"],
  // text ramp
  ["text-ws-text-hi", "text-ws-ink"],
  ["text-ws-text-lo", "text-ws-sage"],
  ["text-ws-text-dim", "text-ws-text-dim"],
  // button variant
  ['variant="accent"', 'variant="primary"'],
  // badge color accent -> purple
  ['color="accent"', 'color="purple"'],
  // spinner border
  ["border-ws-grid border-t-ws-primary", "border-ws-border border-t-ws-primary"],
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith(".tsx")) await processFile(p);
  }
}

async function processFile(file) {
  let text = await fs.readFile(file, "utf8");
  const before = text;
  for (const [from, to] of MAP) {
    text = text.split(from).join(to);
  }
  if (text !== before) {
    await fs.writeFile(file, text, "utf8");
    console.log("updated", path.relative(process.cwd(), file));
  }
}

await walk(root);
console.log("done");
