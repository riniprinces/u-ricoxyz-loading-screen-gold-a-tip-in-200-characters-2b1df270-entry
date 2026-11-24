// Loading Screen Gold: A Tip in 200 Characters
//
// Reads the entry line from entry.txt, validates it against the gate
// (UTF-8 text, a single non-blank line, 1-200 characters), prints it to
// stdout, and also writes it to /output/entry.txt when that directory
// exists, which is where the grader's gate reads the entry from.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

function loadTip(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(here, "entry.txt"), "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length !== 1) {
    throw new Error(`entry.txt must hold exactly one non-blank line, found ${lines.length}`);
  }
  return lines[0].trim();
}

function checkTip(tip: string): void {
  const chars = [...tip].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`tip is ${chars} characters, must be 1-${MAX_CHARS}`);
  }
  if (/\s/.test(tip[0]) || /\s$/.test(tip)) {
    throw new Error("tip must not start or end with whitespace");
  }
}

function main(): void {
  const tip = loadTip();
  checkTip(tip);

  // The grader reads the entry from /output/entry.txt; write it there
  // whenever the directory is available, but never fail the run over it.
  try {
    const outDir = dirname(OUTPUT_PATH);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(OUTPUT_PATH, tip + "\n", "utf8");
  } catch {
    // stdout is the primary output; a missing /output is not fatal.
  }

  process.stdout.write(tip + "\n");
}

try {
  main();
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
