import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { axeViolations } from "../test/axe";
import { NumberTicker } from "./index";

describe("NumberTicker", () => {
  it("renders the final value, a width-holding copy, and one value for assistive technology", async () => {
    const { container } = render(
      <p>
        <NumberTicker value={12480} locale="en" />
      </p>,
    );
    const box = container.querySelector(".kz-count")!;
    expect(box.querySelector(".kz-count-ghost")?.textContent).toBe("12,480");
    const hidden = [...box.children].filter((el) => el.getAttribute("aria-hidden") === "true");
    expect(hidden.map((el) => el.textContent)).toEqual(["12,480", "12,480"]);
    expect(box.querySelector(".sr-only")?.textContent).toBe("12,480");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("formats with the locale and Intl options", () => {
    const { container } = render(<NumberTicker value={1204.5} locale="fr" format={{ style: "currency", currency: "EUR" }} />);
    expect(container.querySelector(".sr-only")?.textContent).toBe(new Intl.NumberFormat("fr", { style: "currency", currency: "EUR" }).format(1204.5));
  });

  it("rolls each digit to a new value, says the trend, and announces it", async () => {
    const user = userEvent.setup();
    function Live() {
      const [v, setV] = useState(1250);
      return (
        <>
          <NumberTicker value={v} trigger="change" announce locale="en" />
          <button type="button" onClick={() => setV(1300)}>
            Bid
          </button>
        </>
      );
    }
    const { container } = render(<Live />);
    const digits = () => [...container.querySelectorAll<HTMLElement>(".kz-count-digit")].map((d) => d.style.getPropertyValue("--kz-digit"));
    expect(digits()).toEqual(["1", "2", "5", "0"]);
    await user.click(screen.getByRole("button"));
    expect(digits()).toEqual(["1", "3", "0", "0"]);
    expect(container.querySelector(".kz-count")?.getAttribute("data-trend")).toBe("up");
    expect(container.querySelector(".sr-only")?.getAttribute("aria-live")).toBe("polite");
    expect(container.querySelector(".sr-only")?.textContent).toBe("1,300");
  });

  it("config vocabulary: `duration` and `easing` drive the roll as well as the climb (CSS variables on the figure)", () => {
    const { container } = render(<NumberTicker value={1250} trigger="change" duration={2000} easing="linear" />);
    const box = container.querySelector(".kz-count") as HTMLElement;
    expect(box.style.getPropertyValue("--kz-count-duration")).toBe("2000ms");
    expect(box.style.getPropertyValue("--kz-count-ease")).toBe("linear");
    const defaults = render(<NumberTicker value={1} trigger="change" />).container.querySelector(".kz-count") as HTMLElement;
    expect(defaults.style.getPropertyValue("--kz-count-duration")).toBe(""); // untouched: the stylesheet's 900 ms roll
    expect(defaults.style.getPropertyValue("--kz-count-ease")).toBe("");
  });

  it("the stylesheet reads them for the roll", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const css = readFileSync(join(import.meta.dirname, "../motion.css"), "utf8");
    expect(css).toMatch(/\.kz-count-digit > span \{[^}]*transition: transform var\(--kz-count-duration, 900ms\) var\(--kz-count-ease, var\(--kz-ease\)\)/);
  });
});
