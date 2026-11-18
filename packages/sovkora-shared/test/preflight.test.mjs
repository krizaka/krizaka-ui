// The document pre-flight every Sovkora app shares: nothing reaches a Studio that cannot be a document.
import assert from "node:assert/strict";

import { test } from "vitest";

import {
  base64ToBytes,
  bytesToLatin1,
  createInspector,
  documentRules,
  maxPdfBytesFor,
  reasonKey,
  spendableCredits,
} from "../src/index.ts";

const enc = (text) => Uint8Array.from(Array.from(text, (c) => c.charCodeAt(0) & 0xff));
const pdf = (body = "1 0 obj << /Type /Catalog >> endobj") => enc(`%PDF-1.7\n${body}\nstartxref\n9\n%%EOF\n`);
const inspect = (bytes, name = "lease.pdf", type = "application/pdf", maxBytes = 1000) =>
  createInspector(documentRules({ maxBytes })).inspect(bytes, { name, type });

test("accepts a PDF that is what it says", async () => {
  assert.deepEqual(await inspect(pdf()), { kind: "accepted", fileKind: "pdf" });
});

for (const [label, bytes, reason] of [
  ["an empty file", new Uint8Array(), "EMPTY"],
  ["a file over the limit", pdf("x".repeat(2000)), "TOO_LARGE"],
  ["a program renamed .pdf", enc("MZ\x90\x00 this is not a document"), "EXECUTABLE"],
  ["a script renamed .pdf", enc("#!/bin/sh\nrm -rf /"), "EXECUTABLE"],
  ["a PNG named .pdf", Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]), "TYPE_MISMATCH"],
  ["a text file named .pdf", enc("just some words, not a PDF"), "TYPE_MISMATCH"],
  ["a PDF cut short", enc("%PDF-1.7\n1 0 obj << /Type /Catalog >> endobj\n"), "TRUNCATED"],
  ["an encrypted PDF", pdf("trailer << /Encrypt 5 0 R >>"), "ENCRYPTED"],
  ["a PDF with JavaScript", pdf("<< /JavaScript 4 0 R >>"), "ACTIVE_CONTENT"],
  ["a PDF with an obfuscated /J#61vaScript", pdf("<< /J#61vaScript 4 0 R >>"), "ACTIVE_CONTENT"],
]) {
  test(`refuses ${label}: ${reason}`, async () => {
    const result = await inspect(bytes);
    assert.equal(result.kind, "rejected");
    assert.equal(result.reason, reason);
  });
}

test("an image is recognised so the refusal can say what it is, but is not accepted as a document", async () => {
  const result = await inspect(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]), "scan.jpg", "image/jpeg");
  assert.deepEqual(result, { kind: "rejected", reason: "UNSUPPORTED_TYPE", detail: "jpeg" });
});

test("a refusal names a message in the app's catalogue", () => {
  assert.equal(reasonKey("ENCRYPTED"), "studios.document.refused.ENCRYPTED");
});

test("a base64 field of N characters holds at most N*3/4 bytes of file", () => {
  assert.equal(maxPdfBytesFor(1_400_000), 1_050_000);
  assert.equal(maxPdfBytesFor(undefined), 10 * 1024 * 1024);
});

test("base64 decodes padded or not, with line breaks; latin1 reads any size", () => {
  assert.deepEqual(Array.from(base64ToBytes("JVBERi0=")), [0x25, 0x50, 0x44, 0x46, 0x2d]);
  assert.deepEqual(Array.from(base64ToBytes("JVBE\nRi0")), [0x25, 0x50, 0x44, 0x46, 0x2d]);
  assert.equal(bytesToLatin1(new Uint8Array(500_000).fill(0x41)).length, 500_000);
});

test("the balance shown is never negative (a dev account at -860 reads 0), while the decision balance stays honest", () => {
  assert.equal(spendableCredits({ balanceGranted: 500, balancePurchased: 300, held: 100 }), 700);
  assert.equal(spendableCredits({ balanceGranted: 0, balancePurchased: 0, held: 860 }), 0);
});

// --- The readers pinned (krizaka-internal#4317): the outputs of the PDF checks, refusals included. ---

test("base64 ignores every character outside its alphabet (spaces, '=', '-', '_', non-ASCII)", () => {
  assert.deepEqual(Array.from(base64ToBytes("JV BE\r\nRi0=")), [0x25, 0x50, 0x44, 0x46, 0x2d]);
  assert.deepEqual(Array.from(base64ToBytes("J-V_B é E=Ri0")), [0x25, 0x50, 0x44, 0x46, 0x2d]);
  assert.equal(base64ToBytes("").length, 0);
  assert.equal(base64ToBytes("====").length, 0);
});

for (const [label, name, type, bytes, expected] of [
  ["an upper-case extension", "LEASE.PDF", "", pdf(), "accepted"],
  ["the last extension decides", "lease.pdf.png", "", pdf(), "TYPE_MISMATCH"],
  ["a dot-file named .pdf", ".pdf", "", pdf(), "accepted"],
  ["no extension: the MIME type decides", "lease", "application/pdf", pdf(), "accepted"],
  ["a trailing dot is no extension: the MIME type decides", "lease.", "application/pdf", pdf(), "accepted"],
  ["a trailing space is no extension: the MIME type decides", "lease.png ", "application/pdf", pdf(), "accepted"],
  ["an extension with a symbol is no extension", "lease.p-df", "image/png", pdf(), "TYPE_MISMATCH"],
  ["a slash after the last dot is no extension", "a.pdf/b", "image/png", pdf(), "TYPE_MISMATCH"],
  ["an unknown extension falls back to the MIME type", "lease.xyz", "image/png", pdf(), "TYPE_MISMATCH"],
  ["an unknown extension and MIME claim nothing", "lease.xyz", "", pdf(), "accepted"],
  ["a text name on text bytes with NUL is allowed", "notes.txt", "", enc("a\0b"), "UNSUPPORTED_TYPE"],
]) {
  test(`the claimed kind: ${label}`, async () => {
    const result = await inspect(bytes, name, type);
    assert.equal(result.kind === "accepted" ? "accepted" : result.reason, expected);
  });
}

for (const [label, body, expected, detail] of [
  ["a name of 41+ characters is cut at 40, the rest is not a name", `<< /${"A".repeat(45)} >>`, "accepted"],
  ["JavaScript followed by more name characters is another name", "<< /JavaScriptX 1 0 R >>", "accepted"],
  ["JavaScript ending the name before a delimiter is active", "<< /JavaScript(x) >>", "ACTIVE_CONTENT", "JavaScript"],
  ["names glued by a slash are both read", "<< /Foo/JS 1 0 R >>", "ACTIVE_CONTENT", "JS"],
  ["a double slash does not hide the name", "<< //Launch >>", "ACTIVE_CONTENT", "Launch"],
  ["#xx escapes decode, either case of hex", "<< /Java#53cript /#4Cunch /#45ncrypt >>", "ENCRYPTED"],
  ["an incomplete escape stays literal", "<< /JS#6 >>", "accepted"],
  ["a non-hex escape stays literal", "<< /JS#zz >>", "accepted"],
  ["an escape yields the character even if it is a symbol", "<< /J#53 >>", "ACTIVE_CONTENT", "JS"],
  ["the found names are sorted and joined", "<< /OpenAction /JavaScript /AA >>", "ACTIVE_CONTENT", "AA, JavaScript, OpenAction"],
  ["an empty name is nothing", "<< / >>", "accepted"],
  ["a name starting with an escape of a slash is read as it decodes", "<< /#2FJS >>", "accepted"],
]) {
  test(`the names: ${label}`, async () => {
    const result = await inspect(pdf(body));
    if (expected === "accepted") assert.deepEqual(result, { kind: "accepted", fileKind: "pdf" });
    else {
      assert.equal(result.reason, expected);
      if (detail) assert.equal(result.detail, detail);
    }
  });
}

test("the trailer: both startxref and %%EOF must sit in the last 2048 bytes", async () => {
  const filler = "x".repeat(2100);
  const big = (text) => inspect(enc(text), "lease.pdf", "application/pdf", 10_000);
  assert.equal((await big(`%PDF-1.7\n${filler}\nstartxref\n9\n%%EOF`)).kind, "accepted");
  assert.equal((await big(`%PDF-1.7\nstartxref\n${filler}\n%%EOF`)).reason, "TRUNCATED");
  assert.equal((await big(`%PDF-1.7\n%%EOF\n${filler}\nstartxref`)).reason, "TRUNCATED");
  assert.equal((await inspect(enc("%PDF-1.7\nstartxref\n9\n"))).reason, "TRUNCATED");
  assert.equal((await inspect(enc("%PDF-1.7\n9\n%%EOF\n"))).reason, "TRUNCATED");
  assert.equal((await inspect(enc("%PDF-1.7\nSTARTXREF\n%%eof\n"))).reason, "TRUNCATED");
});

test("an active name before the cut-off trailer check is not reached: TRUNCATED first", async () => {
  assert.equal((await inspect(enc("%PDF-1.7\n<< /JavaScript 1 0 R >>\n"))).reason, "TRUNCATED");
});
