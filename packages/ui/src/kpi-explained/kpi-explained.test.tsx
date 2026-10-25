import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { KpiExplained } from "./index";

const common = {
  label: "Chiffre d’affaires",
  value: 699446,
  format: { type: "money", currency: "CAD" } as const,
  locale: "fr-CA",
  meaning: "Ce montant est entré dans la caisse pendant le mois.",
  formulaLabel: "Calcul",
  formula: "Ventes TTC − remboursements",
  sourceLabel: "Source",
  source: <a href="/rapport.csv">rapport-mars.csv</a>,
  thresholds: { direction: "above" as const, watchAt: 600000, actAt: 700000 },
  stateLabels: { ok: "Correct", watch: "À surveiller", act: "À agir" },
  freshness: {
    lastRead: "2026-10-22T12:00:00.000Z",
    expectedAt: "2026-10-23T12:00:00.000Z",
    now: "2026-10-23T13:00:00.000Z",
    lastReadLabel: "Lu pour la dernière fois",
    staleLabel: "Données à actualiser",
  },
  maskedLabel: "Valeur masquée",
};

describe("KpiExplained", () => {
  it("formats money with @krizaka/intl and shows the host's threshold state and freshness", async () => {
    const { container } = render(<KpiExplained {...common} verify={<button type="button">Vérifier</button>} />);
    expect(container.querySelector(".kz-kpi-value")?.textContent).toBe("6\u00a0994,46\u00a0$");
    expect(screen.getByText("À surveiller").getAttribute("data-state")).toBe("watch");
    expect(screen.getByRole("status").textContent).toBe("Données à actualiser");
    expect(screen.getByRole("link", { name: "rapport-mars.csv" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Vérifier" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the value's formatted shape but never renders the actual value when masked", async () => {
    const { container } = render(<KpiExplained {...common} masked />);
    expect(container.querySelector(".kz-kpi-value")?.textContent).toBe("•\u00a0••••••\u00a0•");
    expect(screen.getByRole("img", { name: "Valeur masquée" })).toBeTruthy();
    expect(container.textContent).not.toContain("6\u00a0994,46\u00a0$");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("formats freshness in the supplied time zone regardless of the server or browser zone", () => {
    const previousTimeZone = process.env.TZ;
    const props = { ...common, timeZone: "America/Toronto" };
    const serverProps = { ...props, locale: "fr-CA-u-nu-latn" };
    const browserProps = { ...props, locale: "fr-CA-u-ca-gregory" };
    try {
      process.env.TZ = "UTC";
      const server = renderToString(<KpiExplained {...serverProps} />);
      process.env.TZ = "America/Los_Angeles";
      const { container } = render(<KpiExplained {...browserProps} />);
      expect(container.querySelector("time")?.textContent).toBe(server.match(/<time[^>]*>(.*?)<\/time>/u)?.[1]);
      expect(container.querySelector("time")?.textContent).toBe("22 oct. 2026, 08 h 00");
    } finally {
      if (previousTimeZone === undefined) delete process.env.TZ;
      else process.env.TZ = previousTimeZone;
    }
  });

  it.each([
    [699999, "watch"],
    [700000, "act"],
    [599999, "ok"],
  ] as const)("derives the state from the supplied thresholds (%s)", (value, state) => {
    render(<KpiExplained {...common} value={value} freshness={{ ...common.freshness, expectedAt: "2026-10-24T12:00:00.000Z" }} />);
    expect(document.querySelector(".kz-kpi")?.getAttribute("data-state")).toBe(state);
    expect(screen.queryByRole("status")).toBeNull();
  });
});
