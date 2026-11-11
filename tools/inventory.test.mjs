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

describe("tables and long lists (PS2)", () => {
  it("a table with its own engine, or TanStack imported by the app, is a duplicate of data-table v2", () => {
    assert.equal(conceptOf("JobsDataTable").concept.id, "table");
    assert.equal(classify("export function DataTable() { return <table />; }")[0].status, "doublon");
    assert.equal(classify('import { DataTable } from "@krizaka/ui/data-table";\nexport function JobsDataTable() {}')[0].status, "composite");
    const sig = classify('import { useReactTable } from "@tanstack/react-table";\nexport function Jobs() {}');
    assert.deepEqual(sig.map((x) => [x.concept, x.status]), [["table", "signature"]]);
    assert.deepEqual(classify("export function Legend() { return <table><caption>Layers</caption></table>; }"), []);
  });

  it("a virtualised list or an infinite feed by hand, or on FlashList / TanStack Virtual directly, is a duplicate", () => {
    assert.equal(classify("export function MessagesVirtualList() {}")[0].status, "doublon");
    assert.equal(classify('import { VirtualList } from "@krizaka/ui/virtual";\nexport function MessagesVirtualList() {}')[0].status, "composite");
    assert.equal(classify('import { List } from "@krizaka/ui/native/list";\nexport function FeedInfiniteList() {}')[0].status, "composite");
    assert.deepEqual(classify('import { FlashList } from "@shopify/flash-list";\nexport function Feed() {}').map((x) => x.concept), ["list"]);
    assert.deepEqual(classify('import { useVirtualizer } from "@tanstack/react-virtual";\nexport function Gallery() {}').map((x) => x.concept), ["list"]);
  });
});

describe("classify", () => {
  it("a catalogue name over the primitive is an adapter", () => {
    const f = classify('import { Button as Base } from "@krizaka/ui/button";\nexport function Button() {}');
    assert.deepEqual(f.map((x) => [x.symbol, x.status]), [["Button", "adaptateur"]]);
  });

  it("a product component on the primitive, on the product kit or listed in §2.2 is a legitimate composite", () => {
    assert.equal(classify('import { Card } from "@krizaka/ui/card";\nexport function AuctionCard() {}')[0].status, "composite");
    assert.equal(classify('import { Dialog } from "@krizaka/sovkora-design-system";\nexport function JobModal() {}')[0].status, "composite");
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
  const web = "products/verikora/apps/web";
  const files = {
    [`${web}/components/ui/index.ts`]: [
      'export { Card } from "@krizaka/ui/card";',
      'export { LiveBadge } from "@krizaka/verikora-design-system";',
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
      LiveBadge: "@krizaka/verikora-design-system",
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
    const web = report.repos.find((r) => r.name === "verikora-web");
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
      "products/verikora/apps/web/components/VideoCard.tsx": "export function VideoCard() {}",
      "products/verikora/apps/web/components/VideoCard.test.tsx": "export function VideoCard() {}",
      "products/verikora/apps/web/components/Card.stories.tsx": "export function Card() {}",
      "products/verikora/apps/web/node_modules/x/Button.tsx": "export function Button() {}",
      "products/verikora/apps/web/components/illustrations/Mascot.tsx": "export function DuckAvatar() {}",
      "products/verikora/apps/web/console/components/ConfirmDialog.tsx": 'import { AlertDialog } from "@krizaka/ui/dialog";\nexport function ConfirmDialog() {}',
      "products/notes.md": "",
      "app/components/ThemeProvider.tsx": "export function ThemeProvider() {}",
      "company/x.tsx": "export function Button() {}",
    });
    assert.deepEqual(sourceFiles(join(base, "products/verikora/apps/web")).map((f) => f.split("/").pop()).sort(), ["ConfirmDialog.tsx", "Mascot.tsx", "VideoCard.tsx"]);
    const report = inventory({ base });
    const byName = Object.fromEntries(report.repos.map((r) => [r.name, r]));
    assert.equal(report.repos.length, REPOS.length);
    assert.deepEqual(byName["verikora-web"].findings.map((f) => [f.file, f.status]), [["components/VideoCard.tsx", "doublon"], ["console/components/ConfirmDialog.tsx", "adaptateur"]]);
    assert.equal(byName["verikora-web"].findings.find((f) => f.file === "console/components/ConfirmDialog.tsx").status, "adaptateur");
    assert.deepEqual(byName["krizaka-com"].findings.map((f) => f.symbol), ["ThemeProvider"]);
    assert.equal(byName["verikora-mobile"].missing, true);

    const md = toMarkdown(report);
    assert.match(md, /\| verikora-web \| 3 \| 1 \| 0 \| 1 \|/);
    assert.match(md, /\*\*2 doublon\(s\) à migrer\.\*\*/);
    assert.match(md, /\| verikora-mobile \| — \| clone absent/);
    assert.match(issueBody(byName["verikora-web"]), /`components\/VideoCard.tsx` \| `VideoCard` \| Carte \| `@krizaka\/ui\/card`/);
  });

  it("reads an overridden path for one repository", () => {
    const base = tree({});
    const site = tree({ "app/Search.tsx": "export function SearchCommand() {}" });
    const report = inventory({ base, overrides: { "krizaka-com": site } });
    assert.equal(report.repos.find((r) => r.name === "krizaka-com").findings[0].status, "doublon");
    assert.match(toMarkdown(report), /\*\*1 doublon\(s\) à migrer\.\*\*/);
  });
});

// ADR-026 phase D: the concepts' endings and modules are lists, and the declarations are read in two steps. The expectations
// were recorded from the regex version; a comparison on 8,775 real source files, 18,000 names and 5,000 generated files gave no
// difference (but the wording of the `why` of the virtual-list signature, which now names the modules).
import { hasSuffix, importsFromAny, mentionsPrimitive, VIRTUAL_LIST_LIBRARIES } from "./inventory.mjs";

describe("the lists behind the concepts", () => {
  it("hasSuffix: an ending, or a word then an ending, on a plain name", () => {
    assert.equal(hasSuffix("ShareProfileButton", ["Button"]), true);
    assert.equal(hasSuffix("Toasts", ["Toast", "Toasts"]), true);
    assert.equal(hasSuffix("ButtonGroup", ["Button"]), false);
    const confirm = { contains: "Confirm", endsWith: ["Dialog", "Button", "Modal"] };
    for (const name of ["ConfirmDialog", "CostConfirmDialog", "ConfirmPaymentButton"]) assert.equal(hasSuffix(name, confirm), true, name);
    for (const name of ["Confirm", "ConfirmModalX", "Dialog", "Confirm$Dialog"]) assert.equal(hasSuffix(name, confirm), false, name);
    const theme = { prefix: "Theme", endsWith: ["Provider", "Switch", "Switcher"] };
    assert.equal(hasSuffix("ThemeSwitch", theme), true);
    assert.equal(hasSuffix("MyThemeSwitch", theme), false);
    assert.equal(hasSuffix("ThemeX", theme), false);
  });

  it("mentionsPrimitive: @krizaka/ui/<module> to the end of a word", () => {
    assert.equal(mentionsPrimitive('import { Button } from "@krizaka/ui/button";', ["button", "confirm-button"]), true);
    assert.equal(mentionsPrimitive("@krizaka/ui/button-group", ["button"]), true, "a dash ends the word");
    assert.equal(mentionsPrimitive("@krizaka/ui/buttons", ["button"]), false);
    assert.equal(mentionsPrimitive("@krizaka/ui/native/list", ["virtual", "native/list"]), true);
    assert.equal(mentionsPrimitive("@krizaka/ui", ["button"]), false);
  });

  it("importsFromAny: a file that imports one of the modules", () => {
    const virtual = importsFromAny(VIRTUAL_LIST_LIBRARIES);
    assert.equal(virtual.test(`import { useVirtualizer } from '@tanstack/react-virtual'`), true);
    assert.equal(virtual.test(`export * from "react-window"`), true);
    assert.equal(virtual.test(`import x from "react-windowed"`), false);
    assert.equal(virtual.test(`import x from "react"`), false);
    assert.match(virtual.source, /"@tanstack\/react-virtual"/);
  });

  it("definitions: modifiers, factories, helpers, indented and destructured declarations", () => {
    const text = [
      "export default async function Foo() {}",
      "export const Bar = 1",
      "export  default",
      "function Baz() {}",
      "const Tabs = createBottomTabNavigator()",
      "  const Indented = 1",
      "let Typed: Foo<A> = 2",
      "const Late =\n  createX(1)",
      "const A = 1, B = 2",
      "export const { E } = x",
      "const buttonClass = 1",
    ].join("\n");
    assert.deepEqual(definitions(text), ["Foo", "Bar", "Baz", "Typed", "A", "buttonClass"].filter((n) => n !== "Late"));
  });
});

import { importsOf } from "./inventory-source.mjs";

describe("importsOf", () => {
  it("reads default, named, type and multi-line imports", () => {
    const text = 'import a from "x";\nimport type { B as C, D } from "y";\nimport {\n  E,\n} from \'z\';\nimport type T from "t";';
    assert.deepEqual(importsOf(text).map((i) => [i.spec, i.names.map((n) => n.as)]), [
      ["x", []], ["y", ["C", "D"]], ["z", ["E"]], ["t", []],
    ]);
  });
  it("returns within a bound on a long run of spaces or a missing closing token", () => {
    const started = performance.now();
    for (const evil of [`import ${" ".repeat(100000)}x`, `import a${" ".repeat(100000)}from`, `${"import a ".repeat(5000)}`]) {
      assert.deepEqual(importsOf(evil), []);
    }
    assert.ok(performance.now() - started < 1000);
  });
});
