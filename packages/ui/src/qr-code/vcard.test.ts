import { describe, expect, it } from "vitest";

import { escapeVCard, vCard } from "./vcard";

describe("vCard", () => {
  it("writes a 3.0 card with CRLF lines and every fact it was given", () => {
    const card = vCard({ name: "Salon Cèdre & Ciseaux", organization: "9999-9999 Québec inc.", address: { street: "100 rue Exemple", city: "Montréal", region: "QC", postalCode: "H0H 0H0", country: "Canada" }, email: "bonjour@example.test", phone: "514-555-0100", url: "https://example.test" });
    expect(card.split("\r\n")).toEqual([
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Salon Cèdre & Ciseaux",
      "ORG:9999-9999 Québec inc.",
      "ADR;TYPE=WORK:;;100 rue Exemple;Montréal;QC;H0H 0H0;Canada",
      "EMAIL;TYPE=WORK:bonjour@example.test",
      "TEL;TYPE=WORK:514-555-0100",
      "URL:https://example.test",
      "END:VCARD",
    ]);
  });

  it("leaves out what is missing or blank, and keeps an address with only a city", () => {
    expect(vCard({ name: "Cèdre", organization: "  ", email: null, address: { city: "Montréal" } }).split("\r\n")).toEqual(["BEGIN:VCARD", "VERSION:3.0", "FN:Cèdre", "ADR;TYPE=WORK:;;;Montréal;;;", "END:VCARD"]);
    expect(vCard({ name: "Cèdre", address: { street: " " } })).not.toContain("ADR");
  });

  it("escapes the characters the format reserves, so a name cannot add a line", () => {
    expect(escapeVCard("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
    expect(vCard({ name: "A\r\nTEL:911" })).not.toContain("\r\nTEL:911");
  });
});
