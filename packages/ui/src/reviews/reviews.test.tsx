import { render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ReviewCard, ReviewSummary } from "./index";

const summary = {
  score: 4.8,
  count: 27,
  distribution: [0, 1, 2, 4, 20] as const,
  scoreText: "4,8 / 5",
  countText: "27 avis vérifiés",
  summaryText: "4,8 sur 5, 27 avis vérifiés",
  starText: (stars: number, n: number) => `${stars} étoiles : ${n} avis`,
};

describe("ReviewSummary (krizaka-ui#606)", () => {
  it("shows the score as a stamp and the count, and says it all once in text", async () => {
    const { container } = render(<ReviewSummary {...summary} />);
    const stamp = container.querySelector(".kz-stamp") as HTMLElement;
    expect(stamp.textContent).toBe("4,8 / 5");
    expect(container.textContent).toContain("27 avis vérifiés");
    const group = screen.getByRole("group", { name: "4,8 sur 5, 27 avis vérifiés" });
    expect(group).toBeTruthy();
    // The visible stamp and count are for the eye; the text equivalent is what is read.
    expect((container.querySelector(".kz-reviews-visual") as HTMLElement).getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws the distribution as five meters, five stars first, each named and valued", () => {
    render(<ReviewSummary {...summary} />);
    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(5);
    expect(meters.map((meter) => meter.getAttribute("aria-label") ?? meter.getAttribute("aria-labelledby"))).toBeTruthy();
    expect(screen.getByRole("meter", { name: "5 étoiles : 20 avis" }).getAttribute("aria-valuenow")).toBe("20");
    expect(screen.getByRole("meter", { name: "1 étoiles : 0 avis" }).getAttribute("aria-valuenow")).toBe("0");
    expect(screen.getByRole("meter", { name: "5 étoiles : 20 avis" }).getAttribute("aria-valuemax")).toBe("27");
    expect(within(screen.getByRole("group")).getAllByRole("listitem")).toHaveLength(5);
  });

  it("renders nothing under the host's minimum", () => {
    const { container, rerender } = render(<ReviewSummary {...summary} count={4} minCount={5} />);
    expect(container.firstChild).toBeNull();
    rerender(<ReviewSummary {...summary} count={5} minCount={5} />);
    expect(container.firstChild).not.toBeNull();
    rerender(<ReviewSummary {...summary} count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("is never a school grade", () => {
    const { container } = render(<ReviewSummary {...summary} />);
    expect(container.textContent).not.toMatch(/\/\s?20/);
    expect(container.querySelector(".kz-grade, [data-grade]")).toBeNull();
  });
});

describe("ReviewCard (krizaka-ui#606)", () => {
  const card = { author: "Camille L.", date: "octobre 2026", dateTime: "2026-10", service: "Coupe femme", rating: 5, ratingText: "5 sur 5", text: "Une coupe exactement comme je l'imaginais." };

  it("shows who, when, which service, the rating and the words", async () => {
    const { container } = render(<ReviewCard {...card} />);
    const article = screen.getByRole("article");
    expect(within(article).getByText("Camille L.")).toBeTruthy();
    expect(article.querySelector("time")?.getAttribute("datetime")).toBe("2026-10");
    expect(within(article).getByText("Coupe femme")).toBeTruthy();
    expect(within(article).getByText("5 sur 5")).toBeTruthy();
    expect(within(article).getByText("Une coupe exactement comme je l'imaginais.")).toBeTruthy();
    expect(article.querySelector(".kz-review-stars")?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("indents the owner's reply, labelled, in the text face", () => {
    const { container } = render(<ReviewCard {...card} reply={{ label: "Réponse du salon", author: "Maëlle", text: "Merci Camille !" }} />);
    const reply = container.querySelector(".kz-review-reply") as HTMLElement;
    expect(reply.textContent).toContain("Réponse du salon");
    expect(reply.textContent).toContain("Maëlle");
    expect(reply.textContent).toContain("Merci Camille !");
  });

  it("has no reply block without a reply, and fills the stars to the rating", () => {
    const { container } = render(<ReviewCard {...card} rating={3} />);
    expect(container.querySelector(".kz-review-reply")).toBeNull();
    expect(container.querySelectorAll(".kz-review-stars [data-filled]")).toHaveLength(3);
    expect(container.querySelectorAll(".kz-review-stars svg")).toHaveLength(5);
  });
});
