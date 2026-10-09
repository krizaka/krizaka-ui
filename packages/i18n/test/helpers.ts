import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** A temporary folder with the given files (path → content; objects are written as JSON). */
export function tree(files: Record<string, unknown>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "krizaka-i18n-"));
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof content === "string" ? content : JSON.stringify(content, null, 2));
  }
  return dir;
}
