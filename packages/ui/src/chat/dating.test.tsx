// The dating kit on the web: the age gate, the time, distances, the photo grid, the deck, the match, the tags, the
// step head and the chat parts — roles, words, keyboard, no axe violation.
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Conversation from "../../registry/examples/chat/conversation";
import Inbox from "../../registry/examples/chat/inbox";
import ItsAMatch from "../../registry/examples/match-dialog/its-a-match";
import ProfilePhotos from "../../registry/examples/photo-grid/profile-photos";
import SignUp from "../../registry/examples/step-progress/sign-up";
import Discover from "../../registry/examples/swipe-deck/discover";
import Interests from "../../registry/examples/tag-selector/interests";
import { axeViolations } from "../test/axe";

describe("photo grid", () => {
  it("moves a photo with its buttons and announces it", async () => {
    const { container } = render(<ProfilePhotos />);
    await userEvent.click(screen.getByRole("button", { name: "Move earlier — Photo 2" }));
    expect(screen.getByText("Moved to place 1")).toBeTruthy();
    expect(screen.getAllByRole("group")[0]!.getAttribute("aria-label")).toContain("Elena with her guitar, Main");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("swipe deck", () => {
  it("decides with the keys and the buttons, and says it", async () => {
    vi.useFakeTimers();
    const { container } = render(<Discover />);
    const deck = screen.getByRole("group", { name: /Profiles/ });
    fireEvent.keyDown(deck, { key: "ArrowRight" });
    await act(async () => vi.advanceTimersByTime(300));
    expect(screen.getByText("Camille: Like")).toBeTruthy();
    expect(within(deck).getByRole("article", { name: "Tomás, 31" })).toBeTruthy();
    vi.useRealTimers();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("match, tags, steps, chat", () => {
  it("opens the match dialog named by its title", async () => {
    render(<ItsAMatch defaultOpen />);
    expect(screen.getByRole("dialog", { name: "It's a match!" })).toBeTruthy();
  });

  it("rests the other tags at the limit", async () => {
    const { container } = render(<Interests />);
    await userEvent.click(screen.getByRole("button", { name: "Cooking" }));
    await userEvent.click(screen.getByRole("button", { name: "Hiking" }));
    expect(screen.getByText("5 of 5 chosen")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Cinema" }) as HTMLButtonElement).disabled).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("says the step, the receipts, the unread counts", async () => {
    render(<SignUp />);
    expect(screen.getByRole("progressbar", { name: "Step 2 of 5" }).getAttribute("aria-valuenow")).toBe("2");
    const { container } = render(<Conversation />);
    expect(screen.getByText("Read")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Elena is typing");
    expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(true);
    await userEvent.type(screen.getByRole("textbox", { name: "Message" }), "Saturday?");
    expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(false);
    expect(await axeViolations(container)).toEqual([]);
    const inbox = render(<Inbox />);
    const elena = inbox.container.querySelector('a[href="#/chats/elena"]')!;
    expect(elena.textContent).toMatch(/Elena, online.*2 unread/);
    expect(await axeViolations(inbox.container)).toEqual([]);
  });
});
