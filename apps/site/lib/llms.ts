import { readFileSync } from "node:fs";
import path from "node:path";

import { getSource, pageText } from "@/lib/docs-source";
import { getDictionary } from "@/lib/i18n";
import { KRIZAKA_JAVA_URL, KRIZAKA_UI_REPO_URL, KRIZAKA_URL, SITE_URL } from "@/lib/site";
import { getRegistryItems } from "@/lib/ui-registry";
import { absoluteUrl } from "@/lib/urls";

/** The packages documented here, with the version this site was built from (the workspace packages). */
const PACKAGES = ["ui", "tokens", "tailwind", "icons", "fonts", "charts", "intl", "i18n", "query", "realtime", "push", "app-config", "config"];

function packageLine(name: string): string {
  // The workspace package itself (packages/<name>): the version of this commit.
  const file = path.join(process.cwd(), "..", "..", "packages", name, "package.json");
  const pkg = JSON.parse(readFileSync(file, "utf8")) as { name: string; version: string; description?: string };
  const about = pkg.description?.split(/(?<=\.)\s/)[0] ?? "";
  return `- ${pkg.name}@${pkg.version}${about ? ` — ${about}` : ""}: https://www.npmjs.com/package/${pkg.name}`;
}

/** llms.txt (https://llmstxt.org) of ui.krizaka.com, rendered at build from the same source as the pages. */
export function renderLlms(): string {
  const t = getDictionary("en");
  const pages = getSource("en").getPages();
  const written = pages
    .filter((page) => !(page.data as { component?: string }).component)
    .sort((a, b) => a.url.localeCompare(b.url))
    .map((page) => {
      const { title, description } = pageText(page, t);
      return `- [${title}](${absoluteUrl("en", page.url)}): ${description}`;
    });
  const components = getRegistryItems().map((item) => `- [${item.title}](${absoluteUrl("en", `/components/${item.name}`)}): ${item.summary.replace(/`/g, "")}`);
  return [
    "# Krizaka UI",
    "",
    `> ${t.site.meta.description}`,
    "",
    `Every page is generated from the code of the packages in ${KRIZAKA_UI_REPO_URL} (apps/site), at every change: a component's page comes from its meta.ts, its named examples and the JSDoc of its props. French: ${SITE_URL}/fr/.`,
    `Krizaka UI is an open-source project of Krizaka (${KRIZAKA_URL}); its Java half is Krizaka Java (${KRIZAKA_JAVA_URL}).`,
    "",
    "## Guides",
    "",
    ...written,
    "",
    "## Components",
    "",
    ...components,
    "",
    "## Packages",
    "",
    ...PACKAGES.map(packageLine),
    "",
  ].join("\n");
}
