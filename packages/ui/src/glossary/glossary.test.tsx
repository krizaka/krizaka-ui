import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Glossary } from "./index";

describe("Glossary", () => {
  it("lists the host's entries as a named section and semantic descriptions", async () => {
    const { container } = render(
      <Glossary
        title="Les mots du commerce"
        terms={[
          { id: "gross", term: "Ventes TTC", definition: "Les ventes, toutes taxes comprises." },
          { id: "margin", term: "Marge brute", definition: "Les ventes moins le coût des produits vendus." },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Les mots du commerce" })).toBeTruthy();
    expect(screen.getByText("Ventes TTC")).toBeTruthy();
    expect(screen.getByText("Les ventes, toutes taxes comprises.")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
