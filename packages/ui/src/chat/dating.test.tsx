// The dating kit on the web: the age gate, the time, distances, the photo grid, the deck, the match, the tags, the
// step head and the chat parts — roles, words, keyboard, no axe violation.
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Conversation from "../../registry/examples/chat/conversation";
import Inbox from "../../registry/examples/chat/inbox";
import PillComposer from "../../registry/examples/chat/pill-composer";
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

describe("pill composer", () => {
  it("sends with Enter, adds a line with Shift+Enter, holds the send while busy, and keeps its box", async () => {
    const onSend = vi.fn();
    const { MessageComposer } = await import("./chat");
    const { rerender, container } = render(
      <MessageComposer variant="pill" value="Hello" onValueChange={() => {}} onSend={onSend} placeholder="Ask" sendLabel="Send" status="Local" leading={<button type="button">Chat</button>} />,
    );
    const box = screen.getByRole("textbox", { name: "Ask" });
    const send = screen.getByRole("button", { name: "Send" }) as HTMLButtonElement;
    expect(send.disabled).toBe(false);
    fireEvent.keyDown(box, { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(box, { key: "Enter" });
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status").textContent).toBe("Local");
    // one border only: the textarea has none of its own
    expect(box.className).toContain("border-0");
    const pill = send.parentElement!;
    rerender(<MessageComposer variant="pill" value="Hello" busy onValueChange={() => {}} onSend={onSend} placeholder="Ask" sendLabel="Send" status="Answering" leading={<button type="button">Chat</button>} />);
    expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Ask" }), { key: "Enter" });
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(container.querySelector("form")!.getAttribute("aria-busy")).toBe("true");
    expect(send.parentElement).toBe(pill);
  });

  it("can send an attachment alone (canSend) and has no axe violation", async () => {
    const onSend = vi.fn();
    const { MessageComposer } = await import("./chat");
    const { container } = render(<MessageComposer variant="pill" value="" canSend onValueChange={() => {}} onSend={onSend} placeholder="Ask" sendLabel="Send" />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(await axeViolations(container)).toEqual([]);
    const ex = render(<PillComposer />);
    expect(await axeViolations(ex.container)).toEqual([]);
  });
});
