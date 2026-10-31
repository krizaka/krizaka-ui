import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { vCard } from "../qr-code/vcard";
import { axeViolations } from "../test/axe";
import { IdentityCard } from "./index";

const qr = { value: vCard({ name: "Cèdre", email: "bonjour@example.test" }), label: "Contact card: scan to add it", lead: "Scan to add the contact", copyLabel: "Copy the vCard", copiedLabel: "Copied" };

describe("IdentityCard", () => {
  it("is headed by the name, with its subtitle, chips and a contact QR code", async () => {
    const { container } = render(<IdentityCard mark={<span>C</span>} eyebrow="Business card" name="9999-9999 Québec inc." subtitle="Salon Cèdre" chips={<span>NEQ 0000000000</span>} qr={qr} />);
    expect(screen.getByRole("heading", { level: 2, name: "9999-9999 Québec inc." })).toBeTruthy();
    expect(screen.getByText("Salon Cèdre")).toBeTruthy();
    expect(screen.getByText("NEQ 0000000000")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Contact card: scan to add it" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Copy the vCard/ })).toBeTruthy();
    expect(screen.getByText("Scan to add the contact")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("hides the decorative mark, takes the heading level asked, and draws no code without `qr`", () => {
    render(<IdentityCard mark={<span data-testid="mark">C</span>} name="Cèdre" nameAs="h1" />);
    expect(screen.getByTestId("mark").closest("[aria-hidden='true']")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Cèdre" })).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
