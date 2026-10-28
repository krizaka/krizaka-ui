import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { diffWords, lines, words } from "../../registry/examples/proposal/default";
import { axeViolations } from "../test/axe";
import { DiffView, ProposalReview, type ProposalReviewProps } from "./index";

const base: ProposalReviewProps = { agent: "Planner agent", summary: "Move the reminder.", confidence: { level: "high", label: "High confidence", percent: 92 }, state: "waiting", locale: "en-CA", words, onApprove: () => {}, onReject: () => {} };

describe("DiffView", () => {
  it("signs and labels each line, so the colour is never the only signal", async () => {
    const { container } = render(<DiffView lines={lines} words={diffWords} />);
    expect(await axeViolations(container)).toEqual([]);
    const rows = [...container.querySelectorAll("[data-kind]")];
    expect(rows.map((r) => r.getAttribute("data-kind"))).toEqual(["context", "removed", "added"]);
    expect(rows[1]!.textContent).toContain("−");
    expect(rows[1]!.textContent).toContain("Removed: Reminder: 3 days before");
    expect(rows[2]!.textContent).toContain("+");
    expect(rows[2]!.textContent).toContain("Added: ");
    expect(screen.getByRole("group", { name: "Proposed changes" })).toBeTruthy();
  });
});

describe("ProposalReview", () => {
  it("says who, what and how sure, in words and figures", async () => {
    const { container } = render(<ProposalReview {...base}><DiffView lines={lines} words={diffWords} /></ProposalReview>);
    expect(await axeViolations(container)).toEqual([]);
    expect(screen.getByRole("region", { name: "Planner agent" })).toBeTruthy();
    expect(screen.getByText("High confidence · 92%")).toBeTruthy();
  });

  it("approves, rejects and edits by keyboard alone", async () => {
    const user = userEvent.setup();
    const [onApprove, onReject, onEdit] = [vi.fn(), vi.fn(), vi.fn()];
    render(<ProposalReview {...base} onApprove={onApprove} onReject={onReject} onEdit={onEdit} />);
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Approve");
    await user.keyboard("{Enter}");
    await user.tab();
    await user.keyboard(" ");
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Edit");
    await user.keyboard("{Enter}");
    expect([onApprove, onReject, onEdit].map((f) => f.mock.calls.length)).toEqual([1, 1, 1]);
  });

  it("takes two presses to approve what cannot be undone", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    render(<ProposalReview {...base} irreversible onApprove={onApprove} />);
    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Approve for good?" }));
    expect(onApprove).toHaveBeenCalledOnce();
  });

  it.each(["approved", "rejected", "expired"] as const)("announces %s and offers no decision any more", (state) => {
    render(<ProposalReview {...base} state={state} />);
    expect(screen.getByRole("status").textContent).toBe(words.states[state]);
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });

  it("offers no slide to approve: the only way is a button", () => {
    const { container } = render(<ProposalReview {...base} />);
    expect(container.querySelector("[draggable],[role=slider]")).toBeNull();
  });
});
