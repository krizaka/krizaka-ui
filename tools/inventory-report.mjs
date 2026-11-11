// WHY  The audit's findings are read by people (a markdown report, the body of an issue per repository), apart from how they are found.
// WHAT `toMarkdown(report)`, `issueBody(repo)` and `isDuplicate`.
// HOW  Imported by tools/inventory.mjs (which re-exports it); nothing to run. Tests: tools/inventory.test.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

import { CONCEPTS } from "./inventory-concepts.mjs";

export const isDuplicate = (f) => f.status === "doublon" || f.status === "signature";
const STATUS = { doublon: "doublon à migrer", signature: "doublon (signature)", composite: "composite produit légitime", adaptateur: "adaptateur de la primitive" };

/** The report as markdown: a summary per repository, then the concepts, then what each repository has to migrate. */
export function toMarkdown(report) {
  const lines = [`# Inventaire UI — ${report.date}`, "", "Concepts du catalogue `@krizaka/ui` (étude §2.1) encore implémentés localement. Lecture seule.", ""];
  lines.push("| Dépôt | Fichiers | Doublons à migrer | Composites légitimes | Adaptateurs |", "| :-- | --: | --: | --: | --: |");
  for (const r of report.repos) {
    if (r.missing) {
      lines.push(`| ${r.name} | — | clone absent | | |`);
      continue;
    }
    const n = (s) => r.findings.filter(s).length;
    lines.push(`| ${r.name} | ${r.files} | ${n(isDuplicate)} | ${n((f) => f.status === "composite")} | ${n((f) => f.status === "adaptateur")} |`);
  }
  const total = report.repos.flatMap((r) => r.findings).filter(isDuplicate).length;
  lines.push("", total === 0 ? "**Aucun doublon** : seuls restent des composites produit et des adaptateurs." : `**${total} doublon(s) à migrer.**`, "");
  for (const c of CONCEPTS) {
    const rows = report.repos.flatMap((r) => r.findings.filter((f) => f.concept === c.id).map((f) => ({ ...f, repo: r.name })));
    if (rows.length === 0) continue;
    lines.push(`## ${c.label} → \`${c.target}\``, "", "| Dépôt | Fichier | Symbole | Statut |", "| :-- | :-- | :-- | :-- |");
    for (const f of rows.sort((a, b) => Number(isDuplicate(b)) - Number(isDuplicate(a)) || a.repo.localeCompare(b.repo))) {
      lines.push(`| ${f.repo} | \`${f.file}\` | \`${f.symbol}\` | ${STATUS[f.status]} (${f.why}) |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

/** What one repository has to migrate, as the body of an issue. */
export function issueBody(repo) {
  const dups = repo.findings.filter(isDuplicate);
  const label = (id) => CONCEPTS.find((c) => c.id === id);
  return [
    `L'audit final du programme UI (\`krizaka-ui/tools/inventory.mjs\`, étude §2.1) trouve ${dups.length} implémentation(s) locale(s) de concepts du catalogue \`@krizaka/ui\` dans ce dépôt :`,
    "",
    "| Fichier | Symbole | Concept | Cible |",
    "| :-- | :-- | :-- | :-- |",
    ...dups.map((f) => `| \`${f.file}\` | \`${f.symbol}\` | ${label(f.concept).label} | \`${label(f.concept).target}\` |`),
    "",
    `**Prompt de migration** (company/prompts-claude-code.md) : ${repo.prompt}. Règle : un composite produit garde son nom s'il est construit sur la primitive (niveau 2/3, §2.2) ; une copie de primitive disparaît au profit de \`@krizaka/ui\`.`,
    "",
    "Vérification : `node tools/inventory.mjs --repo <ce-dépôt>=<chemin>` dans krizaka-ui ne doit plus lister ce dépôt en « doublon ».",
  ].join("\n");
}

