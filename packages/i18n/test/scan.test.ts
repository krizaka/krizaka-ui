import path from "node:path";

import ts from "typescript";

import { scanHardcoded } from "../src/check-entry";
import { tree } from "./helpers";

const root = path.join(import.meta.dirname, "fixtures", "app");

describe("scanHardcoded", () => {
  it("reports every kind of hard-coded user-facing string", () => {
    const offenders = scanHardcoded(ts, {
      paths: [path.join(root, "components"), path.join(root, "app"), path.join(root, "missing")],
      allow: ["Acme", "Krizaka"],
      skip: ["/app/api/"],
      root,
    });
    expect(offenders.map((o) => `${o.file}:${o.line} [${o.kind}] ${o.text}`)).toEqual([
      "components/Card.tsx:3 [set setError] Something went wrong",
      "components/Card.tsx:4 [set setError] Saved",
      "components/Card.tsx:4 [set setError] Failed for …",
      "components/Card.tsx:6 [dialog] alert",
      "components/Card.tsx:7 [dialog] window.confirm",
      "components/Card.tsx:8 [prop label] Open the vault",
      "components/Card.tsx:10 [attr title] Card title",
      "components/Card.tsx:11 [text] Hello world",
      "components/Card.tsx:13 [text] Shown when ok",
      "components/Card.tsx:14 [text] Anonymous person",
      "components/Card.tsx:15 [text] Fallback text",
      "components/Card.tsx:16 [text] Nothing here",
      "components/Card.tsx:17 [text] Template … text",
      "components/Card.tsx:20 [attr alt] Picture of the team",
      "components/Card.tsx:21 [text] Type here",
    ]);
  });

  it("scans a single file, with a RegExp skip and the current directory as root", () => {
    const file = path.join(root, "app", "page.tsx");
    expect(scanHardcoded(ts, { paths: [file] })).toEqual([]);
    expect(scanHardcoded(ts, { paths: [path.join(root, "components", "util.ts")] })).toEqual([]);
    expect(scanHardcoded(ts, { paths: [path.join(root, "app")], skip: [/page/] }).map((o) => o.text)).toEqual(["Not scanned api text"]);
  });

  it("leaves dependencies and build output out", () => {
    const dir = tree({ "node_modules/x/a.tsx": "export const a = <p>Vendor text</p>;", "src/b.tsx": "export const b = <p>Own text</p>;" });
    expect(scanHardcoded(ts, { paths: [dir], root: dir }).map((o) => o.file)).toEqual(["src/b.tsx"]);
  });
});
