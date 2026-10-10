// node --test tools/ — the inventory's classification, on fixtures written to a temporary folder.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { classify, conceptOf, definitions, doorSources, inventory, issueBody, readDoor, REPOS, sourceFiles, toMarkdown } from "./inventory.mjs";

const tree = (files) => {
  const dir = mkdtempSync(join(tmpdir(), "kz-inventory-"));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), content);
  }
  return dir;
};

describe("definitions and concepts", () => {
  it("reads top-level components, skips library factories and constants", () => {
    const text = [
      "export function VideoCard() {}",
      "export const TipModal = () => null;",
      "const Tabs = createBottomTabNavigator();",
      "export const buttonClass = tv({});",
      "const helper = 1;",
    ].join("\n");
    assert.deepEqual(definitions(text), ["VideoCard", "TipModal", "buttonClass"]);
  });

  it("gives a name to the most specific concept, by catalogue name or by suffix", () => {
    assert.equal(conceptOf("ConfirmIconButton").concept.id, "confirm");
    assert.equal(conceptOf("GlobalSearchModal").concept.id, "command");
    assert.equal(conceptOf("Button").by, "name");
    assert.equal(conceptOf("ShareProfileButton").by, "suffix");
    assert.equal(conceptOf("ThemeModeSelector").concept.id, "theme");
    assert.equal(conceptOf("VideoPlayer"), undefined);
  });
});

describe("classify", () => {
  it("a catalogue name over the primitive is an adapter", () => {
    const f = classify('import { Button as Base } from "@krizaka/ui/button";\nexport function Button() {}');
    assert.deepEqual(f.map((x) => [x.symbol, x.status]), [["Button", "adaptateur"]]);
  });

  it("a product component on the primitive, on the product kit or listed in §2.2 is a legitimate composite", () => {
    assert.equal(classify('import { Card } from "@krizaka/ui/card";\nexport function AuctionCard() {}')[0].status, "composite");
    assert.equal(classify('import { Dialog } from "@krizaka/orazaka-design-system";\nexport function JobModal() {}')[0].status, "composite");
    assert.equal(classify("export function LiveBadge() {}")[0].status, "composite");
    assert.equal(classify('import { Badge } from "@krizaka/ui/native";\nexport function MediaBadge() {}')[0].status, "composite");
  });

  it("a local implementation is a duplicate; a primitive re-done without a catalogue name is one by signature", () => {
    assert.equal(classify("export function VideoCard() { return <div />; }")[0].status, "doublon");
    const sig = classify('export function Player() { return <div role="slider" />; }');
    assert.deepEqual(sig.map((x) => [x.symbol, x.concept, x.status]), [["Player", "slider", "signature"]]);
    assert.deepEqual(classify("export function Overlay() { return createPortal(<div />, document.body); }"), []);
    assert.equal(classify('export function Shell() { return <div role="dialog" aria-modal="true" />; }')[0].concept, "dialog");
    assert.equal(classify('import { Command } from "cmdk";\nexport function Finder() {}')[0].concept, "command");
  });
});

describe("the product's door", () => {
  const web = "products/orochia/apps/web";
  const files = {
    [`${web}/components/ui/index.ts`]: [
      'export { Card } from "@krizaka/ui/card";',
      'export { LiveBadge } from "@krizaka/orochia-design-system";',
      'export { Button, type ButtonProps, IconButton } from "./Button";',
      'export { Dialog, Sheet, countdownUnits } from "./client";',
    ].join("\n"),
    [`${web}/components/ui/Button.tsx`]: 'import { Button as UiButton, IconButton as UiIconButton } from "@krizaka/ui/button";\nexport function Button() {}\nexport function IconButton() {}',
    [`${web}/components/ui/client.tsx`]: 'import { Dialog as UiDialog, Sheet as UiSheet } from "@krizaka/ui/dialog";\nimport React from "react";\nexport const Dialog = {};\nexport function Sheet() {}',
    [`${web}/components/VideoCard.tsx`]: 'import { Button, Card } from "@/components/ui";\nexport function VideoCard() {}',
    [`${web}/components/money/WithdrawSheet.tsx`]: 'import { Button, Sheet } from "../ui";\nexport function WithdrawSheet() {}',
    [`${web}/components/challenges/StageBadge.tsx`]: 'import { LiveBadge } from "@/components/ui";\nexport function ChallengeStageBadge() {}',
    [`${web}/components/TagChip.tsx`]: 'import { Button } from "@/components/ui";\nexport function TagChip() {}',
    [`${web}/components/Player.tsx`]: 'import { Card } from "@/components/ui";\nexport function Player() { return <input type="range" />; }',
  };

  it("maps every name it exports to the package module it comes from, through its own files too", () => {
    const base = tree(files);
    const door = readDoor(sourceFiles(join(base, web)));
    assert.deepEqual(Object.fromEntries(door.names), {
      Card: "@krizaka/ui/card",
      LiveBadge: "@krizaka/orochia-design-system",
      Button: "@krizaka/ui/button",
      IconButton: "@krizaka/ui/button",
      Dialog: "@krizaka/ui/dialog",
      Sheet: "@krizaka/ui/dialog",
    });
    const file = join(base, web, "components/money/WithdrawSheet.tsx");
    assert.deepEqual(doorSources(files[`${web}/components/money/WithdrawSheet.tsx`], file, join(base, web), door), ["@krizaka/ui/button", "@krizaka/ui/dialog"]);
  });

  it("a component importing the concept's primitive through the door is a composite; another primitive is not enough", () => {
    const report = inventory({ base: tree(files) });
    const web = report.repos.find((r) => r.name === "orochia-web");
    const status = Object.fromEntries(web.findings.map((f) => [f.symbol, [f.status, f.why]]));
    assert.deepEqual(status.VideoCard, ["composite", "importe la primitive par la porte du produit"]);
    assert.equal(status.WithdrawSheet[0], "composite");
    assert.deepEqual(status.ChallengeStageBadge, ["composite", "sur le design system produit"]);
    assert.equal(status.TagChip[0], "doublon");
    assert.equal(status.Player[0], "signature");
    assert.equal(status.Button[0], "adaptateur");
  });
});

describe("inventory", () => {
  it("scans the repositories, skips tests, stories, builds and illustrations, and reports missing clones", () => {
    const base = tree({
      "products/orochia/apps/web/components/VideoCard.tsx": "export function VideoCard() {}",
      "products/orochia/apps/web/components/VideoCard.test.tsx": "export function VideoCard() {}",
      "products/orochia/apps/web/components/Card.stories.tsx": "export function Card() {}",
      "products/orochia/apps/web/node_modules/x/Button.tsx": "export function Button() {}",
      "products/orochia/apps/web/components/illustrations/Mascot.tsx": "export function DuckAvatar() {}",
      "products/orochia-admin/components/ConfirmDialog.tsx": 'import { AlertDialog } from "@krizaka/ui/dialog";\nexport function ConfirmDialog() {}',
      "products/notes.md": "",
      "app/components/ThemeProvider.tsx": "export function ThemeProvider() {}",
      "company/x.tsx": "export function Button() {}",
    });
    assert.deepEqual(sourceFiles(join(base, "products/orochia/apps/web")).map((f) => f.split("/").pop()).sort(), ["Mascot.tsx", "VideoCard.tsx"]);
    const report = inventory({ base });
    const byName = Object.fromEntries(report.repos.map((r) => [r.name, r]));
    assert.equal(report.repos.length, REPOS.length);
    assert.deepEqual(byName["orochia-web"].findings.map((f) => [f.file, f.status]), [["components/VideoCard.tsx", "doublon"]]);
    assert.equal(byName["orochia-admin"].findings[0].status, "adaptateur");
    assert.deepEqual(byName["krizaka-com"].findings.map((f) => f.symbol), ["ThemeProvider"]);
    assert.equal(byName["orochia-mobile"].missing, true);

    const md = toMarkdown(report);
    assert.match(md, /\| orochia-web \| 2 \| 1 \| 0 \| 0 \|/);
    assert.match(md, /\*\*2 doublon\(s\) à migrer\.\*\*/);
    assert.match(md, /\| orochia-mobile \| — \| clone absent/);
    assert.match(issueBody(byName["orochia-web"]), /`components\/VideoCard.tsx` \| `VideoCard` \| Carte \| `@krizaka\/ui\/card`/);
  });

  it("reads an overridden path for one repository", () => {
    const base = tree({});
    const site = tree({ "app/Search.tsx": "export function SearchCommand() {}" });
    const report = inventory({ base, overrides: { "krizaka-com": site } });
    assert.equal(report.repos.find((r) => r.name === "krizaka-com").findings[0].status, "doublon");
    assert.match(toMarkdown(report), /\*\*1 doublon\(s\) à migrer\.\*\*/);
  });
});
