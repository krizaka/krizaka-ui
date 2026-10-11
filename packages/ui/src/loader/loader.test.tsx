import { act, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Loader, LoadingRegion } from "./index";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe("Loader", () => {
  it("shows nothing for a fast answer: the live region exists, empty", () => {
    const { rerender } = render(<Loader label="Loading invoices" successLabel="Loaded" />);
    const status = screen.getByRole("status");
    advance(100);
    expect(status.textContent).toBe("");
    rerender(<Loader label="Loading invoices" status="success" successLabel="Loaded" />);
    advance(2000);
    expect(status.textContent).toBe("");
  });

  it("shows a slow wait after its delay, holds it, then draws and says the ending", () => {
    const { container, rerender } = render(<Loader label="Loading invoices" successLabel="12 invoices loaded" value={0.5} eta="About 10 s left" />);
    advance(260);
    expect(screen.getByRole("status").textContent).toBe("Loading invoices50 % · About 10 s left");
    expect(container.querySelector("[data-progress]")?.getAttribute("data-progress")).toBe("50");
    rerender(<Loader label="Loading invoices" successLabel="12 invoices loaded" status="success" />);
    advance(300);
    expect(screen.getByRole("status").dataset.phase, "held at least 600 ms").toBe("loading");
    advance(400);
    advance(1);
    expect(screen.getByRole("status").textContent).toBe("12 invoices loaded");
    expect(container.querySelector(".kz-loader-mark")).not.toBeNull();
    advance(1700);
    expect(screen.getByRole("status").dataset.phase).toBe("idle");
  });

  it("shows the ending it is rendered with, with no axe violation", async () => {
    vi.useRealTimers();
    const { container } = render(<Loader label="Publishing" status="error" errorLabel="Could not publish" endDuration={Infinity} />);
    expect(screen.getByRole("status").textContent).toBe("Could not publish");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("LoadingRegion", () => {
  it("hands over: invisible placeholder, skeleton, words when slow, then the content", () => {
    const { container, rerender } = render(
      <LoadingRegion loading label="Loading the creator" slowLabel="Still loading" skeleton={<i data-testid="skeleton" />}>
        <p>Eric</p>
      </LoadingRegion>,
    );
    const region = container.firstElementChild as HTMLElement;
    expect(region.getAttribute("aria-busy")).toBe("true");
    expect(region.dataset.phase).toBe("pending");
    advance(210);
    expect(region.dataset.phase).toBe("skeleton");
    expect(screen.getByRole("status").textContent).toBe("Loading the creator");
    advance(4100);
    expect(region.dataset.phase).toBe("slow");
    expect(screen.getByRole("status").textContent).toBe("Still loading");
    rerender(
      <LoadingRegion loading={false} label="Loading the creator" skeleton={<i />}>
        <p>Eric</p>
      </LoadingRegion>,
    );
    advance(10);
    expect(region.dataset.phase).toBe("ready");
    expect(screen.getByText("Eric")).toBeTruthy();
    expect(region.getAttribute("aria-busy")).toBe("false");
  });
});
