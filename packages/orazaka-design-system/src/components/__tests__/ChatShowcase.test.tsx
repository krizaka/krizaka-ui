import { act, render } from "@testing-library/react";

import { ChatShowcase } from "../ChatShowcase";

const props = {
  labels: {
    agent: "Orazaka",
    status: "Online · local",
    model: "local",
    routed: "Routed locally",
    privacy: "Nothing leaves",
    placeholder: "Ask",
  },
  question: "Summarise this contract",
  answer: "The contract renews yearly. ".repeat(6).trim(),
  pipeline: ["Context", "Security", "Credits", "Validation"],
};

/** The conversation is sized by an invisible copy of its final state, so the card never grows while it plays. */
describe("ChatShowcase layout stability", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const ghost = (c: HTMLElement) => c.querySelector("[data-chat-ghost]") as HTMLElement;

  it("reserves the final state from the very first frame", () => {
    const { container } = render(<ChatShowcase {...props} />);
    expect(ghost(container)).toHaveAttribute("aria-hidden", "true");
    expect(ghost(container).className).toContain("invisible");
    expect(ghost(container).textContent).toContain(props.answer);
    for (const step of props.pipeline) expect(ghost(container).textContent).toContain(step);
  });

  it("keeps the same reserved content at every phase and at the end", () => {
    const { container } = render(<ChatShowcase {...props} />);
    const start = ghost(container).innerHTML;
    for (const ms of [700, 700, 1100, 200]) act(() => void vi.advanceTimersByTime(ms));
    expect(ghost(container).innerHTML).toBe(start);
    act(() => void vi.advanceTimersByTime(5000));
    expect(ghost(container).innerHTML).toBe(start);
  });

  it("shows the final state directly under reduced motion", () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    })) as never;
    const { container } = render(<ChatShowcase {...props} />);
    const live = ghost(container).nextElementSibling as HTMLElement;
    expect(live.textContent).toContain(props.answer);
    expect(live.textContent).toContain("Validation");
  });
});

/** The footer is not a drawing: it is the kit's MessageComposer (pill), inert, so the card and the app's chat are the same component. */
describe("ChatShowcase composer", () => {
  it("renders the real pill composer, inert and hidden from assistive technology", () => {
    const { container } = render(<ChatShowcase {...props} />);
    const field = container.querySelector("textarea")!;
    expect(field).toHaveAttribute("placeholder", "Ask");
    const host = field.closest("[inert]")!;
    expect(host).toHaveAttribute("aria-hidden", "true");
    expect(host.querySelector("button[type=submit]")).toBeDisabled();
    expect(host.querySelector("[role=status]")!.textContent).toContain("Nothing leaves");
  });
});
