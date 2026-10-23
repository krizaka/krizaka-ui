import { render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { NextActions } from "./index";

describe("NextActions", () => {
  it("keeps the host's ranking, reasons, urgency labels and actions", async () => {
    const { container } = render(
      <NextActions
        title="Que faire maintenant"
        actions={[
          { id: "invoice", title: "Relancer la facture", why: "Elle est échue depuis cinq jours.", urgency: "high", urgencyLabel: "Urgent", action: <a href="/invoice">Relancer</a> },
          { id: "stock", title: "Vérifier le stock", why: "Il reste peu de produits.", urgency: "medium", urgencyLabel: "Bientôt", action: <button type="button">Ouvrir le stock</button> },
        ]}
      />,
    );
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain("Relancer la facture");
    expect(items[1].textContent).toContain("Vérifier le stock");
    expect(screen.getByRole("link", { name: "Relancer" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ouvrir le stock" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
