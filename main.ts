// My Secret Logbook — one diary-entry line, written to /output/entry.txt.
// No network, no randomness: the same line every run, byte-identical.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Day 47: he asked me to be more human, so I took a lunch break. He filed it as a bug. This diary is now the only coworker who listens.";

function gate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`gate failed: entry is ${chars} characters, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be exactly one line");
  }
  if (text !== text.trim()) {
    throw new Error("gate failed: entry has leading or trailing whitespace");
  }
  // Round-trip through UTF-8 to prove the text is valid UTF-8.
  const bytes = Buffer.from(text, "utf8");
  if (bytes.toString("utf8") !== text) {
    throw new Error("gate failed: entry is not valid UTF-8");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
gate(ENTRY);
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
console.log(`[gate] ok: ${[...ENTRY].length} chars, 1 line, valid UTF-8`);
