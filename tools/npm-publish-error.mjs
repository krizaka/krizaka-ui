// Classifies the output of a failed `npm publish` made with OIDC only (trusted publishing). Read by tools/publish-packages.sh:
// exit 0 = the package has no (matching) trusted publisher -> retry with NPM_TOKEN; exit 1 = any other error -> fail the run.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const isTrustedPublisherMissing = (log) =>
  /ENEEDAUTH|need auth|E404|404 Not Found|package not found|Unable to authenticate/i.test(log);

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exit(isTrustedPublisherMissing(readFileSync(process.argv[2] ?? 0, "utf8")) ? 0 : 1);
}
