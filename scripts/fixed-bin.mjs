// The absolute path of a command-line tool, looked up in fixed system folders only — never in the `PATH` variable, which a
// shell profile or a parent process can fill with a writable folder (Sonar S4036). Dependency-free.
import { existsSync } from "node:fs";
import { join } from "node:path";

export const SYSTEM_BIN_DIRS = ["/usr/bin", "/bin", "/usr/local/bin", "/opt/homebrew/bin", "/usr/sbin"];

/**
 * @param {string} name  a bare command name (`git`, `ffmpeg`, `docker`)
 * @param {readonly string[]} [dirs]
 * @returns {string} the absolute path of the executable
 */
export function fixedBin(name, dirs = SYSTEM_BIN_DIRS) {
  if (!/^[a-z][a-z0-9._-]*$/i.test(name)) throw new Error(`not a command name: ${name}`);
  const found = dirs.map((dir) => join(dir, name)).find((file) => existsSync(file));
  if (!found) throw new Error(`${name} is not installed in ${dirs.join(", ")}`);
  return found;
}
